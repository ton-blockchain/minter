import { Address } from "ton";
import { Network } from "./network";

export type AddressHistory = Record<Network, string[]>;
export const ADDRESS_HISTORY_LIMIT = 20;

export function normalizeAddressHistory(value: AddressHistory | string[]): AddressHistory {
  const history: AddressHistory = { mainnet: [], testnet: [] };
  const add = (value: string, network: Network) => {
    try {
      const raw = Address.parse(value).toString();
      if (!history[network].includes(raw) && history[network].length < ADDRESS_HISTORY_LIMIT) {
        history[network].push(raw);
      }
    } catch {}
  };

  if (Array.isArray(value)) {
    // Older clients omitted the test-only flag even for testnet searches.
    value.forEach((address) => {
      try {
        const { isTestOnly } = Address.parseFriendly(address);
        add(address, isTestOnly ? "testnet" : "mainnet");
        if (!isTestOnly) add(address, "testnet");
      } catch {}
    });
  } else {
    (["mainnet", "testnet"] as const).forEach((network) => {
      if (Array.isArray(value?.[network])) {
        value[network].forEach((address) => add(address, network));
      }
    });
  }
  return history;
}
