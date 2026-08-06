import {
  SendTransactionRequest,
  SendTransactionResponse,
  TonConnectUI,
} from "@tonconnect/ui-react";
import { Address, beginCell, Cell, parseMessage } from "ton";
import {
  Network,
  NETWORK_CONFIG,
  TONCENTER_API_KEY,
  formatAddress,
  formatRawAddress,
  getCurrentNetwork,
} from "./network";

export const TRANSACTION_TTL_SECONDS = 5 * 60;
export const TRANSACTION_TRACKING_TIMEOUT_MS = 90_000;

export type TransactionOutcome = {
  status: "confirmed" | "submitted";
  externalMessageHash?: string;
};

type ToncenterTransaction = {
  account?: string;
  description?: {
    aborted?: boolean;
    compute_ph?: { skipped?: boolean; success?: boolean; exit_code?: number };
    action?: { success?: boolean; result_code?: number } | null;
  };
  in_msg?: { bounce?: boolean; bounced?: boolean } | null;
};

type ToncenterTrace = {
  is_incomplete?: boolean;
  trace_info?: { trace_state?: string; pending_messages?: number };
  transactions?: Record<string, ToncenterTransaction>;
};

type TraceResponse = { traces?: ToncenterTrace[] };

export class TransactionOnchainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionOnchainError";
  }
}

let transactionInProgress = false;

export function buildTransactionRequest(
  network: Network,
  sender: Address | string,
  messages: SendTransactionRequest["messages"],
  nowSeconds = Math.floor(Date.now() / 1000),
): SendTransactionRequest {
  return {
    validUntil: nowSeconds + TRANSACTION_TTL_SECONDS,
    network: NETWORK_CONFIG[network].chain,
    from: formatRawAddress(sender),
    messages,
  };
}

export function buildTransactionMessage(
  address: Address | string,
  network: Network,
  amount: string,
  options?: { stateInit?: string; payload?: string },
): SendTransactionRequest["messages"][number] {
  return {
    address: formatAddress(address, network),
    amount,
    stateInit: options?.stateInit,
    payload: options?.payload,
  };
}

export function getExternalMessageHash(boc: string): string {
  const roots = Cell.fromBoc(Buffer.from(boc, "base64"));
  if (roots.length !== 1) throw new Error("Wallet returned an invalid transaction BOC");
  const message = parseMessage(roots[0].beginParse());
  if (message.info.type !== "external-in") {
    throw new Error("Wallet returned a BOC that is not an external-in message");
  }

  // TEP-467: normalize fields that can have different valid serializations for
  // the same external message before using its hash for indexer lookup.
  return beginCell()
    .storeUint(2, 2)
    .storeAddress(null)
    .storeAddress(message.info.dest)
    .storeCoins(0)
    .storeBit(0)
    .storeBit(1)
    .storeRef(message.body)
    .endCell()
    .hash()
    .toString("base64");
}

function normalizeAddress(address: string): string {
  return Address.parse(address).toString().toLowerCase();
}

function transactionError(transaction: ToncenterTransaction): string | null {
  const description = transaction.description;
  if (!description) return "missing transaction description";
  if (transaction.in_msg?.bounced) return "an internal message bounced";
  if (description.aborted) {
    return `transaction aborted (exit code ${description.compute_ph?.exit_code ?? "unknown"})`;
  }
  if (
    description.compute_ph &&
    !description.compute_ph.skipped &&
    (description.compute_ph.success === false ||
      (description.compute_ph.success !== true &&
        description.compute_ph.exit_code !== 0 &&
        description.compute_ph.exit_code !== 1))
  ) {
    return `compute phase failed (exit code ${description.compute_ph.exit_code ?? "unknown"})`;
  }
  if (description.action && (!description.action.success || description.action.result_code !== 0)) {
    return `action phase failed (result code ${description.action.result_code ?? "unknown"})`;
  }
  return null;
}

export function validateCompletedTrace(trace: ToncenterTrace, target: Address | string): void {
  const transactions = Object.values(trace.transactions ?? {});
  const normalizedTarget = normalizeAddress(
    typeof target === "string" ? target : target.toString(),
  );
  const targetSeen = transactions.some(
    (transaction) =>
      !!transaction.account && normalizeAddress(transaction.account) === normalizedTarget,
  );
  if (!targetSeen) {
    throw new TransactionOnchainError("Target contract did not execute the transaction");
  }

  for (const transaction of transactions) {
    const isTarget =
      !!transaction.account && normalizeAddress(transaction.account) === normalizedTarget;
    if (!isTarget && transaction.in_msg?.bounce === false && !transaction.in_msg.bounced) {
      // Optional NoBounce descendants (for example transfer_notification to an
      // uninitialized owner account) may abort after the actual token operation
      // has completed. They must not turn a successful transfer into a retry.
      continue;
    }
    const failure = transactionError(transaction);
    if (failure) throw new TransactionOnchainError(`Transaction failed on-chain: ${failure}`);
  }
}

async function fetchTrace(
  network: Network,
  hash: string,
  fetchImpl: typeof fetch,
  timeoutMs: number,
): Promise<ToncenterTrace | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = new URL(`${NETWORK_CONFIG[network].toncenterV3}/traces`);
    url.searchParams.set("msg_hash", hash);
    url.searchParams.set("limit", "1");
    const response = await fetchImpl(url.toString(), {
      headers: { "X-API-Key": TONCENTER_API_KEY },
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error(
        `Toncenter trace request failed with HTTP ${response.status}`,
      ) as Error & {
        status?: number;
        retryAfterMs?: number;
      };
      error.status = response.status;
      if (response.status === 429) {
        const retryAfter = response.headers?.get("retry-after");
        const retryAfterSeconds = Number(retryAfter);
        if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
          error.retryAfterMs = retryAfterSeconds * 1_000;
        }
      }
      throw error;
    }
    const data = (await response.json()) as TraceResponse;
    return data.traces?.[0] ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

function isRetryableTraceError(error: unknown): boolean {
  const candidate = error as { status?: number; name?: string };
  return (
    candidate?.name === "AbortError" ||
    candidate?.status === 408 ||
    candidate?.status === 429 ||
    (candidate?.status !== undefined && candidate.status >= 500) ||
    candidate?.status === undefined
  );
}

export async function waitForTransactionTrace(
  network: Network,
  externalMessageHash: string,
  target: Address | string,
  options: {
    attempts?: number;
    intervalMs?: number;
    fetchImpl?: typeof fetch;
    sleepFn?: (time: number) => Promise<unknown>;
    timeoutMs?: number;
    nowFn?: () => number;
  } = {},
): Promise<"confirmed" | "submitted"> {
  const attempts = options.attempts ?? 30;
  const intervalMs = options.intervalMs ?? 3_000;
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleepFn =
    options.sleepFn ?? ((time) => new Promise((resolve) => setTimeout(resolve, time)));
  const timeoutMs = options.timeoutMs ?? TRANSACTION_TRACKING_TIMEOUT_MS;
  const nowFn = options.nowFn ?? Date.now;
  const deadline = nowFn() + timeoutMs;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const remainingMs = deadline - nowFn();
    if (remainingMs <= 0) break;

    let trace: ToncenterTrace | null = null;
    let retryAfterMs = 0;
    try {
      trace = await fetchTrace(
        network,
        externalMessageHash,
        fetchImpl,
        Math.min(10_000, remainingMs),
      );
    } catch (error) {
      // The wallet has already submitted the message. An indexer/configuration
      // failure must not be presented as if the on-chain operation itself failed.
      if (!isRetryableTraceError(error)) return "submitted";
      retryAfterMs = (error as { retryAfterMs?: number }).retryAfterMs ?? 0;
    }
    if (
      trace &&
      trace.is_incomplete === false &&
      trace.trace_info?.trace_state === "complete" &&
      trace.trace_info.pending_messages === 0
    ) {
      // Keep validation outside the transport catch: a completed trace proving
      // an on-chain failure is final and must never degrade to "submitted".
      validateCompletedTrace(trace, target);
      return "confirmed";
    }
    if (attempt < attempts - 1) {
      const timeUntilDeadline = deadline - nowFn();
      if (timeUntilDeadline <= 0) break;
      const sleepMs = Math.min(Math.max(intervalMs, retryAfterMs), timeUntilDeadline);
      await sleepFn(sleepMs);
    }
  }

  return "submitted";
}

function assertConnectedAccount(connection: TonConnectUI, request: SendTransactionRequest): void {
  const account = connection.account;
  if (!account) throw new Error("Wallet not connected");
  if (account.chain !== request.network) {
    throw new Error("Wallet network does not match the network selected in the app");
  }
  if (!request.from || !Address.parse(account.address).equals(Address.parse(request.from))) {
    throw new Error("Connected wallet changed before the transaction was sent");
  }
}

function assertCurrentNetwork(network: Network, request: SendTransactionRequest): void {
  if (request.network !== NETWORK_CONFIG[network].chain) {
    throw new Error("Transaction request network does not match the selected network");
  }
  if (typeof window !== "undefined" && getCurrentNetwork() !== network) {
    throw new Error("Selected network changed before the transaction was sent");
  }
}

export async function sendTransactionAndTrack(
  connection: TonConnectUI,
  network: Network,
  request: SendTransactionRequest,
  target: Address | string,
): Promise<TransactionOutcome> {
  if (transactionInProgress) throw new Error("Another transaction is already in progress");
  assertCurrentNetwork(network, request);
  assertConnectedAccount(connection, request);
  transactionInProgress = true;
  try {
    const response = (await connection.sendTransaction(request)) as SendTransactionResponse;
    if (!response?.boc) return { status: "submitted" };

    let externalMessageHash: string;
    try {
      externalMessageHash = getExternalMessageHash(response.boc);
    } catch (error) {
      console.warn("Unable to derive the submitted transaction hash", error);
      return { status: "submitted" };
    }
    const status = await waitForTransactionTrace(network, externalMessageHash, target);
    return { status, externalMessageHash };
  } finally {
    transactionInProgress = false;
  }
}
