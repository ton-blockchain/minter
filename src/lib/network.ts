import { CHAIN } from "@tonconnect/sdk";
import { Address } from "ton";

export type Network = "mainnet" | "testnet";

export const TONCENTER_API_KEY = "06dbc7b34ce22097c5f22364a55326a65ebf58c5690cbad9f4695209d4633140";

export const NETWORK_CONFIG: Record<
  Network,
  {
    chain: CHAIN;
    toncenterV2: string;
    toncenterV3: string;
    explorer: string;
  }
> = {
  mainnet: {
    chain: CHAIN.MAINNET,
    toncenterV2: "https://toncenter.com/api/v2/jsonRPC",
    toncenterV3: "https://toncenter.com/api/v3",
    explorer: "https://tonscan.org",
  },
  testnet: {
    chain: CHAIN.TESTNET,
    toncenterV2: "https://testnet.toncenter.com/api/v2/jsonRPC",
    toncenterV3: "https://testnet.toncenter.com/api/v3",
    explorer: "https://testnet.tonscan.org",
  },
};

export function getNetwork(params: URLSearchParams): Network {
  const value = params.get("testnet");
  return value !== null && value !== "false" && value !== "0" ? "testnet" : "mainnet";
}

export function getCurrentNetwork(): Network {
  return getNetwork(new URLSearchParams(window.location.search));
}

export function formatAddress(
  address: Address | string,
  network: Network,
  bounceable = true,
): string {
  const parsed = typeof address === "string" ? Address.parse(address) : address;
  return parsed.toFriendly({
    urlSafe: true,
    bounceable,
    testOnly: network === "testnet",
  });
}

export function formatRawAddress(address: Address | string): string {
  return (typeof address === "string" ? Address.parse(address) : address).toString();
}

export function setSearchParam(
  params: URLSearchParams,
  name: string,
  value?: string,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (value) {
    next.set(name, value);
  } else {
    next.delete(name);
  }
  return next;
}
