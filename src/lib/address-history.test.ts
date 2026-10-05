import { Address } from "ton";
import { normalizeAddressHistory } from "./address-history";
import { formatAddress } from "./network";

const account = Address.parseRaw(`0:${"ab".repeat(32)}`);

test("migrates legacy history by network and deduplicates bounceable variants", () => {
  expect(
    normalizeAddressHistory([
      formatAddress(account, "testnet", false),
      formatAddress(account, "mainnet", true),
      formatAddress(account, "mainnet", false),
      "invalid",
    ]),
  ).toEqual({ mainnet: [account.toString()], testnet: [account.toString()] });
});

test("keeps raw identities separate by network and limits each history to 20", () => {
  const raw = Array.from({ length: 22 }, (_, index) =>
    new Address(-1, Buffer.alloc(32, index)).toString(),
  );
  expect(normalizeAddressHistory({ mainnet: raw, testnet: [account.toString()] })).toEqual({
    mainnet: raw.slice(0, 20),
    testnet: [account.toString()],
  });
});
