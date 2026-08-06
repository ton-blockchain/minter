import { Address, TonClient } from "ton";
import { getCurrentNetwork, Network, NETWORK_CONFIG, TONCENTER_API_KEY } from "./network";

const MAX_ATTEMPTS = 3;

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isRetryableToncenterError(error: unknown): boolean {
  const candidate = error as {
    code?: string;
    message?: string;
    response?: { status?: number; data?: unknown };
  };
  const status = candidate?.response?.status;
  if (status === 408 || status === 429 || (status !== undefined && status >= 500)) return true;
  if (["ECONNABORTED", "ECONNRESET", "ETIMEDOUT", "ERR_NETWORK"].includes(candidate?.code ?? "")) {
    return true;
  }
  return /network|timeout|temporar|lite_server_network|429|5\d\d/i.test(
    `${candidate?.message ?? ""} ${JSON.stringify(candidate?.response?.data ?? "")}`,
  );
}

function retryDelay(error: unknown, attempt: number): number {
  const response = (
    error as {
      response?: {
        status?: number;
        headers?: Record<string, unknown> & { get?: (name: string) => unknown };
      };
    }
  )?.response;
  if (response?.status === 429) {
    const retryAfter = response.headers?.get?.("retry-after") ?? response.headers?.["retry-after"];
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;
  }
  return 500 * 2 ** attempt + Math.floor(Math.random() * 250);
}

export async function retryToncenterRequest<T>(
  operation: () => Promise<T>,
  sleepFn: (time: number) => Promise<unknown> = sleep,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableToncenterError(error) || attempt === MAX_ATTEMPTS - 1) throw error;
      await sleepFn(retryDelay(error, attempt));
    }
  }
  throw lastError;
}

class ToncenterClient extends TonClient {
  private reliable<T>(operation: () => Promise<T>): Promise<T> {
    return retryToncenterRequest(operation);
  }

  getContractState(address: Address) {
    return this.reliable(() => super.getContractState(address));
  }

  callGetMethod(address: Address, name: string, params: any[] = []) {
    return this.reliable(() => super.callGetMethod(address, name, params));
  }

  callGetMethodWithError(address: Address, name: string, params: any[] = []) {
    return this.reliable(() => super.callGetMethodWithError(address, name, params));
  }
}

const clients = new Map<Network, TonClient>();

export function getToncenterClientParameters(network: Network) {
  return {
    endpoint: NETWORK_CONFIG[network].toncenterV2,
    apiKey: TONCENTER_API_KEY,
    timeout: 12_000,
  };
}

export async function getClient(network: Network = getCurrentNetwork()): Promise<TonClient> {
  let client = clients.get(network);
  if (!client) {
    client = new ToncenterClient(getToncenterClientParameters(network));
    clients.set(network, client);
  }
  return client;
}

export function getEndpoint(network: Network = getCurrentNetwork()): string {
  return NETWORK_CONFIG[network].toncenterV2;
}
