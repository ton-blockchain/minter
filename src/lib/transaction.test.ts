import { CHAIN, SendTransactionRequest, TonConnectUI } from "@tonconnect/ui-react";
import { Address, beginCell, Cell, CellMessage, CommonMessageInfo, ExternalMessage } from "ton";
import {
  buildTransactionMessage,
  buildTransactionRequest,
  getExternalMessageHash,
  sendTransactionAndTrack,
  validateCompletedTrace,
  waitForTransactionTrace,
} from "./transaction";
import { TONCENTER_API_KEY } from "./network";

const OWNER = Address.parseRaw(`0:${"11".repeat(32)}`);
const TARGET = Address.parseRaw(`0:${"22".repeat(32)}`);

function externalMessage(bodyValue: number) {
  const body = beginCell().storeUint(bodyValue, 32).endCell();
  const message = new Cell();
  new ExternalMessage({
    to: OWNER,
    importFee: 123,
    body: new CommonMessageInfo({ body: new CellMessage(body) }),
  }).writeTo(message);
  const normalized = beginCell()
    .storeUint(2, 2)
    .storeAddress(null)
    .storeAddress(OWNER)
    .storeCoins(0)
    .storeBit(0)
    .storeBit(1)
    .storeRef(body)
    .endCell();
  return { message, normalized };
}

function successfulTrace() {
  return {
    is_incomplete: false,
    trace_info: { trace_state: "complete", pending_messages: 0 },
    transactions: {
      target: {
        account: TARGET.toString(),
        description: {
          aborted: false,
          compute_ph: { skipped: false, success: true, exit_code: 0 },
          action: { success: true, result_code: 0 },
        },
        in_msg: { bounced: false },
      },
    },
  };
}

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => data,
  } as Response;
}

beforeEach(() => {
  window.history.replaceState({}, "", "/?testnet=true");
});

test("builds a network-pinned request with raw sender, friendly target, and seconds TTL", () => {
  const request = buildTransactionRequest(
    "testnet",
    OWNER,
    [buildTransactionMessage(TARGET, "testnet", "100")],
    1_700_000_000,
  );

  expect(request.network).toBe(CHAIN.TESTNET);
  expect(request.from).toBe(OWNER.toString());
  expect(request.validUntil).toBe(1_700_000_300);
  expect(request.messages[0].address.startsWith("kQ")).toBe(true);
});

test("derives the TEP-467 normalized external-message hash from the wallet BOC", () => {
  const { message, normalized } = externalMessage(123);
  expect(getExternalMessageHash(message.toBoc().toString("base64"))).toBe(
    normalized.hash().toString("base64"),
  );
  expect(normalized.hash().equals(message.hash())).toBe(false);
  expect(() =>
    getExternalMessageHash(beginCell().storeUint(123, 32).endCell().toBoc().toString("base64")),
  ).toThrow();
});

test("accepts a complete successful target trace and rejects bounced or missing targets", () => {
  expect(() => validateCompletedTrace(successfulTrace(), TARGET)).not.toThrow();

  const alternativeSuccess = successfulTrace();
  alternativeSuccess.transactions.target.description.compute_ph.exit_code = 1;
  expect(() => validateCompletedTrace(alternativeSuccess, TARGET)).not.toThrow();

  const bounced = successfulTrace();
  bounced.transactions.target.in_msg.bounced = true;
  expect(() => validateCompletedTrace(bounced, TARGET)).toThrow("bounced");

  const computeFailed = successfulTrace();
  computeFailed.transactions.target.description.compute_ph.success = false;
  computeFailed.transactions.target.description.compute_ph.exit_code = 35;
  expect(() => validateCompletedTrace(computeFailed, TARGET)).toThrow("exit code 35");

  const actionFailed = successfulTrace();
  actionFailed.transactions.target.description.action.success = false;
  actionFailed.transactions.target.description.action.result_code = 37;
  expect(() => validateCompletedTrace(actionFailed, TARGET)).toThrow("result code 37");

  expect(() => validateCompletedTrace(successfulTrace(), OWNER)).toThrow(
    "Target contract did not execute",
  );
});

test("ignores an aborted optional NoBounce notification after the target succeeded", () => {
  const trace = successfulTrace();
  (trace.transactions as Record<string, any>).notification = {
    account: OWNER.toString(),
    description: {
      aborted: true,
      compute_ph: { skipped: true, success: false, exit_code: 0 },
      action: null,
    },
    in_msg: { bounce: false, bounced: false },
  };
  expect(() => validateCompletedTrace(trace, TARGET)).not.toThrow();

  (trace.transactions as Record<string, any>).notification.in_msg.bounce = true;
  expect(() => validateCompletedTrace(trace, TARGET)).toThrow("aborted");
});

test("requires explicit complete trace fields before confirming", async () => {
  const trace = successfulTrace() as any;
  delete trace.is_incomplete;
  delete trace.trace_info.pending_messages;

  await expect(
    waitForTransactionTrace("testnet", "hash", TARGET, {
      attempts: 1,
      fetchImpl: jest.fn(async () => jsonResponse({ traces: [trace] })),
    }),
  ).resolves.toBe("submitted");
});

test("polls until the indexed trace is complete and returns pending without lying about success", async () => {
  const fetchImpl = jest
    .fn()
    .mockResolvedValueOnce(jsonResponse({ traces: [] }))
    .mockResolvedValueOnce(jsonResponse({ traces: [successfulTrace()] }));
  const sleepFn = jest.fn(async () => undefined);

  await expect(
    waitForTransactionTrace("testnet", "hash", TARGET, {
      attempts: 2,
      intervalMs: 0,
      fetchImpl,
      sleepFn,
    }),
  ).resolves.toBe("confirmed");
  expect(sleepFn).toHaveBeenCalledTimes(1);

  await expect(
    waitForTransactionTrace("testnet", "missing", TARGET, {
      attempts: 2,
      intervalMs: 0,
      fetchImpl: jest.fn(async () => jsonResponse({ traces: [] })),
      sleepFn,
    }),
  ).resolves.toBe("submitted");
});

test("does not retry or hide a failure proven by a completed trace", async () => {
  const failedTrace = successfulTrace();
  failedTrace.transactions.target.description.compute_ph.success = false;
  failedTrace.transactions.target.description.compute_ph.exit_code = 42;
  const fetchImpl = jest.fn(async () => jsonResponse({ traces: [failedTrace] }));
  const sleepFn = jest.fn(async () => undefined);

  await expect(
    waitForTransactionTrace("testnet", "hash", TARGET, {
      attempts: 3,
      intervalMs: 0,
      fetchImpl,
      sleepFn,
    }),
  ).rejects.toThrow("failed on-chain");
  expect(fetchImpl).toHaveBeenCalledTimes(1);
  expect(sleepFn).not.toHaveBeenCalled();
});

test("keeps an already-sent transaction submitted when the indexer rejects tracking", async () => {
  const fetchImpl = jest.fn(async () => jsonResponse({}, 403));
  const sleepFn = jest.fn(async () => undefined);

  await expect(
    waitForTransactionTrace("testnet", "hash", TARGET, {
      attempts: 3,
      intervalMs: 0,
      fetchImpl,
      sleepFn,
    }),
  ).resolves.toBe("submitted");
  expect(fetchImpl).toHaveBeenCalledTimes(1);
  expect(sleepFn).not.toHaveBeenCalled();
});

test("respects Retry-After and the overall trace tracking deadline", async () => {
  let now = 1_000;
  const sleepFn = jest.fn(async (time: number) => {
    now += time;
  });
  const fetchImpl = jest.fn(async () => jsonResponse({}, 429, { "retry-after": "60" }));

  await expect(
    waitForTransactionTrace("testnet", "hash", TARGET, {
      attempts: 30,
      intervalMs: 3_000,
      timeoutMs: 90_000,
      nowFn: () => now,
      fetchImpl,
      sleepFn,
    }),
  ).resolves.toBe("submitted");
  expect(sleepFn).toHaveBeenNthCalledWith(1, 60_000);
  expect(sleepFn).toHaveBeenNthCalledWith(2, 30_000);
  expect(fetchImpl).toHaveBeenCalledTimes(2);
});

test("refuses a wallet on the wrong network before opening the signing request", async () => {
  const request = buildTransactionRequest("testnet", OWNER, [
    buildTransactionMessage(TARGET, "testnet", "100"),
  ]);
  const sendTransaction = jest.fn();
  const connection = {
    account: { address: OWNER.toString(), chain: CHAIN.MAINNET },
    sendTransaction,
  } as unknown as TonConnectUI;

  await expect(sendTransactionAndTrack(connection, "testnet", request, TARGET)).rejects.toThrow(
    "Wallet network does not match",
  );
  expect(sendTransaction).not.toHaveBeenCalled();
});

test("refuses disconnected, changed-wallet, stale-network, and mismatched requests before signing", async () => {
  const request = buildTransactionRequest("testnet", OWNER, [
    buildTransactionMessage(TARGET, "testnet", "100"),
  ]);
  const sendTransaction = jest.fn();

  await expect(
    sendTransactionAndTrack({ account: null, sendTransaction } as any, "testnet", request, TARGET),
  ).rejects.toThrow("Wallet not connected");

  await expect(
    sendTransactionAndTrack(
      {
        account: { address: TARGET.toString(), chain: CHAIN.TESTNET },
        sendTransaction,
      } as any,
      "testnet",
      request,
      TARGET,
    ),
  ).rejects.toThrow("Connected wallet changed");

  await expect(
    sendTransactionAndTrack(
      {
        account: { address: OWNER.toString(), chain: CHAIN.TESTNET },
        sendTransaction,
      } as any,
      "mainnet",
      request,
      TARGET,
    ),
  ).rejects.toThrow("request network");

  window.history.replaceState({}, "", "/");
  await expect(
    sendTransactionAndTrack(
      {
        account: { address: OWNER.toString(), chain: CHAIN.TESTNET },
        sendTransaction,
      } as any,
      "testnet",
      request,
      TARGET,
    ),
  ).rejects.toThrow("Selected network changed");
  expect(sendTransaction).not.toHaveBeenCalled();
});

test("treats missing or malformed wallet BOCs as submitted after the wallet resolves", async () => {
  const request = buildTransactionRequest("testnet", OWNER, [
    buildTransactionMessage(TARGET, "testnet", "100"),
  ]);
  const connection = (response: unknown) =>
    ({
      account: { address: OWNER.toString(), chain: CHAIN.TESTNET },
      sendTransaction: jest.fn(async () => response),
    } as unknown as TonConnectUI);

  await expect(
    sendTransactionAndTrack(connection({}), "testnet", request, TARGET),
  ).resolves.toEqual({ status: "submitted" });

  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  await expect(
    sendTransactionAndTrack(connection({ boc: "not-a-boc" }), "testnet", request, TARGET),
  ).resolves.toEqual({ status: "submitted" });
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});

test("prevents concurrent signing requests and releases the lock afterwards", async () => {
  const request = buildTransactionRequest("testnet", OWNER, [
    buildTransactionMessage(TARGET, "testnet", "100"),
  ]);
  let resolveFirst: ((value: unknown) => void) | undefined;
  const firstResponse = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  const connection = {
    account: { address: OWNER.toString(), chain: CHAIN.TESTNET },
    sendTransaction: jest.fn(() => firstResponse),
  } as unknown as TonConnectUI;

  const first = sendTransactionAndTrack(connection, "testnet", request, TARGET);
  await expect(sendTransactionAndTrack(connection, "testnet", request, TARGET)).rejects.toThrow(
    "already in progress",
  );
  resolveFirst?.({});
  await expect(first).resolves.toEqual({ status: "submitted" });

  (connection.sendTransaction as jest.Mock).mockResolvedValueOnce({});
  await expect(sendTransactionAndTrack(connection, "testnet", request, TARGET)).resolves.toEqual({
    status: "submitted",
  });
});

test("reports confirmed only after the concrete Toncenter trace succeeds", async () => {
  const { message, normalized } = externalMessage(456);
  const request = buildTransactionRequest("testnet", OWNER, [
    buildTransactionMessage(TARGET, "testnet", "100"),
  ]);
  const sendTransaction = jest.fn(async (_request: SendTransactionRequest) => ({
    boc: message.toBoc().toString("base64"),
  }));
  const connection = {
    account: { address: OWNER.toString(), chain: CHAIN.TESTNET },
    sendTransaction,
  } as unknown as TonConnectUI;
  const fetchSpy = jest
    .spyOn(global, "fetch")
    .mockResolvedValue(jsonResponse({ traces: [successfulTrace()] }));

  await expect(sendTransactionAndTrack(connection, "testnet", request, TARGET)).resolves.toEqual({
    status: "confirmed",
    externalMessageHash: normalized.hash().toString("base64"),
  });
  expect(sendTransaction).toHaveBeenCalledWith(request);
  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining("https://testnet.toncenter.com/api/v3/traces"),
    expect.objectContaining({ headers: { "X-API-Key": TONCENTER_API_KEY } }),
  );
  fetchSpy.mockRestore();
});
