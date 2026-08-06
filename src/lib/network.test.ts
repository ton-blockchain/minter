import { Address } from "ton";
import {
  getClient,
  getEndpoint,
  getToncenterClientParameters,
  isRetryableToncenterError,
  retryToncenterRequest,
} from "./get-ton-client";
import {
  formatAddress,
  getNetwork,
  NETWORK_CONFIG,
  setSearchParam,
  TONCENTER_API_KEY,
} from "./network";
import { scannerUrl } from "utils";

const ADDRESS = Address.parseRaw(`0:${"11".repeat(32)}`);

test("parses network explicitly and does not treat testnet=false as testnet", () => {
  expect(getNetwork(new URLSearchParams())).toBe("mainnet");
  expect(getNetwork(new URLSearchParams("testnet"))).toBe("testnet");
  expect(getNetwork(new URLSearchParams("testnet=true"))).toBe("testnet");
  expect(getNetwork(new URLSearchParams("testnet=false"))).toBe("mainnet");
  expect(getNetwork(new URLSearchParams("foo=testnet"))).toBe("mainnet");
});

test("formats the same account with network-aware friendly flags", () => {
  const mainnet = formatAddress(ADDRESS, "mainnet");
  const testnet = formatAddress(ADDRESS, "testnet");

  expect(mainnet.startsWith("EQ")).toBe(true);
  expect(testnet.startsWith("kQ")).toBe(true);
  expect(Address.parse(mainnet).equals(Address.parse(testnet))).toBe(true);
});

test("query updates replace only their own value and preserve testnet", () => {
  const initial = new URLSearchParams("testnet=true&address=old&other=1");
  const replaced = setSearchParam(initial, "address", "new");
  expect(replaced.getAll("address")).toEqual(["new"]);
  expect(replaced.get("testnet")).toBe("true");
  expect(replaced.get("other")).toBe("1");

  const removed = setSearchParam(replaced, "address");
  expect(removed.has("address")).toBe(false);
  expect(removed.get("testnet")).toBe("true");
});

test("uses fixed Toncenter clients and explorers per network", async () => {
  const mainnet = await getClient("mainnet");
  const testnet = await getClient("testnet");

  expect(mainnet).toBe(await getClient("mainnet"));
  expect(testnet).toBe(await getClient("testnet"));
  expect(mainnet).not.toBe(testnet);
  expect(mainnet.parameters.endpoint).toBe(NETWORK_CONFIG.mainnet.toncenterV2);
  expect(testnet.parameters.endpoint).toBe(NETWORK_CONFIG.testnet.toncenterV2);
  expect(getToncenterClientParameters("mainnet")).toEqual({
    endpoint: NETWORK_CONFIG.mainnet.toncenterV2,
    apiKey: TONCENTER_API_KEY,
    timeout: 12_000,
  });
  expect(getToncenterClientParameters("testnet")).toEqual({
    endpoint: NETWORK_CONFIG.testnet.toncenterV2,
    apiKey: TONCENTER_API_KEY,
    timeout: 12_000,
  });
  expect(getEndpoint("testnet")).toBe("https://testnet.toncenter.com/api/v2/jsonRPC");
  expect(scannerUrl("testnet", false, true)).toBe("https://testnet.tonscan.org/address");
  expect(scannerUrl("testnet", false, false)).toBe("https://testnet.tonscan.org/jetton");
  expect(scannerUrl("mainnet", false, true)).toBe("https://tonscan.org/address");
  expect(scannerUrl("mainnet", false, false)).toBe("https://tonscan.org/jetton");
});

test("retries only transient Toncenter failures", () => {
  expect(isRetryableToncenterError({ response: { status: 429 } })).toBe(true);
  expect(isRetryableToncenterError({ response: { status: 500 } })).toBe(true);
  expect(isRetryableToncenterError({ code: "ETIMEDOUT" })).toBe(true);
  expect(isRetryableToncenterError({ response: { status: 403 } })).toBe(false);
  expect(isRetryableToncenterError(new Error("invalid address"))).toBe(false);
});

test("makes one request plus two retries for transient Toncenter failures", async () => {
  const operation = jest
    .fn()
    .mockRejectedValueOnce({ response: { status: 503 } })
    .mockRejectedValueOnce({ code: "ETIMEDOUT" })
    .mockResolvedValue("ok");
  const sleepFn = jest.fn(async () => undefined);

  await expect(retryToncenterRequest(operation, sleepFn)).resolves.toBe("ok");
  expect(operation).toHaveBeenCalledTimes(3);
  expect(sleepFn).toHaveBeenCalledTimes(2);

  const deterministicFailure = jest.fn(async () => {
    throw { response: { status: 403 } };
  });
  await expect(retryToncenterRequest(deterministicFailure, sleepFn)).rejects.toEqual({
    response: { status: 403 },
  });
  expect(deterministicFailure).toHaveBeenCalledTimes(1);
});

test("respects Toncenter Retry-After for a rate-limited read", async () => {
  const operation = jest
    .fn()
    .mockRejectedValueOnce({ response: { status: 429, headers: { "retry-after": "2" } } })
    .mockResolvedValue("ok");
  const sleepFn = jest.fn(async () => undefined);

  await expect(retryToncenterRequest(operation, sleepFn)).resolves.toBe("ok");
  expect(sleepFn).toHaveBeenCalledWith(2_000);
});
