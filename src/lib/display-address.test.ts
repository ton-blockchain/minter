import { Address } from "ton";
import { getDisplayAddresses } from "./display-address";
import { formatAddress, Network, NETWORK_CONFIG } from "./network";

const account = Address.parseRaw(`0:${"ab".repeat(32)}`);
const other = Address.parseRaw(`0:${"cd".repeat(32)}`);
const fetchMock = jest.spyOn(global, "fetch");
const response = (book: unknown, ok = true) => ({ ok, json: async () => book } as Response);
const book = (address: Address, network: Network, bounceable: boolean) => ({
  [address.toString().toUpperCase()]: {
    user_friendly: formatAddress(address, network, bounceable),
  },
});

beforeEach(() => fetchMock.mockReset());
afterEach(() => jest.useRealTimers());
afterAll(() => fetchMock.mockRestore());

test.each(["mainnet", "testnet"] as const)(
  "uses Toncenter's account format on %s, preserving workchain and identity",
  async (network) => {
    for (const workchain of [0, -1]) {
      for (const bounceable of [false, true]) {
        const address = new Address(workchain, account.hash);
        fetchMock.mockResolvedValueOnce(response(book(address, network, bounceable)));
        const [display] = await getDisplayAddresses([address], network);
        const parsed = Address.parseFriendly(display);
        expect(parsed.address.equals(address)).toBe(true);
        expect(parsed.isBounceable).toBe(bounceable);
        expect(parsed.isTestOnly).toBe(network === "testnet");
        expect(
          new URL(fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as string).origin,
        ).toBe(new URL(NETWORK_CONFIG[network].toncenterV3).origin);
      }
    }
  },
);

test("batches and deduplicates account lookups without changing result order", async () => {
  fetchMock.mockResolvedValueOnce(
    response({
      ...book(account, "mainnet", true),
      ...book(other, "mainnet", false),
    }),
  );
  expect(await getDisplayAddresses([account, other, account], "mainnet")).toEqual([
    formatAddress(account, "mainnet", true),
    formatAddress(other, "mainnet", false),
    formatAddress(account, "mainnet", true),
  ]);
  const url = new URL(fetchMock.mock.calls[0][0] as string);
  expect(url.pathname).toBe("/api/v3/addressBook");
  expect(url.searchParams.getAll("address")).toEqual([account.toString(), other.toString()]);
});

test.each([
  {},
  { error: "unavailable" },
  null,
  [],
  { [account.toString()]: { user_friendly: "invalid" } },
  { [account.toString()]: { user_friendly: account.toString() } },
  { [account.toString()]: { user_friendly: formatAddress(other, "mainnet", false) } },
  book(account, "testnet", false),
])("falls back for missing, malformed or mismatched API data: %j", async (data) => {
  fetchMock.mockResolvedValueOnce(response(data));
  expect(await getDisplayAddresses([account], "mainnet")).toEqual([
    formatAddress(account, "mainnet"),
  ]);
});

test.each(["mainnet", "testnet"] as const)(
  "offline fallback preserves each account on %s",
  async (network) => {
    fetchMock.mockRejectedValue(new Error("offline"));
    expect(await getDisplayAddresses([account, other], network)).toEqual([
      formatAddress(account, network),
      formatAddress(other, network),
    ]);
  },
);

test("HTTP and JSON errors do not prevent displaying the account", async () => {
  fetchMock.mockResolvedValueOnce(response(book(account, "mainnet", false), false));
  expect(await getDisplayAddresses([account], "mainnet")).toEqual([
    formatAddress(account, "mainnet"),
  ]);
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => {
      throw new Error("Bad JSON");
    },
  } as unknown as Response);
  expect(await getDisplayAddresses([account], "mainnet")).toEqual([
    formatAddress(account, "mainnet"),
  ]);
});

test("does not cache failure or the state before a contract was deployed", async () => {
  fetchMock
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(response(book(account, "mainnet", false)))
    .mockResolvedValueOnce(response(book(account, "mainnet", true)));
  await getDisplayAddresses([account], "mainnet");
  expect(await getDisplayAddresses([account], "mainnet")).toEqual([
    formatAddress(account, "mainnet", false),
  ]);
  expect(await getDisplayAddresses([account], "mainnet")).toEqual([
    formatAddress(account, "mainnet", true),
  ]);
  expect(fetchMock).toHaveBeenCalledTimes(3);
});

test("times out even if fetch ignores abort, and aborts the request", async () => {
  jest.useFakeTimers();
  fetchMock.mockReturnValueOnce(new Promise(() => {}));
  const pending = getDisplayAddresses([account], "testnet");
  jest.advanceTimersByTime(10_000);
  expect(await pending).toEqual([formatAddress(account, "testnet")]);
  expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
});

test("rejects invalid inputs without making a request", async () => {
  expect(await getDisplayAddresses(["invalid", "0:ab"], "mainnet")).toEqual(["", ""]);
  expect(fetchMock).not.toHaveBeenCalled();
});
