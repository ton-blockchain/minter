import { useSearchParams } from "react-router-dom";

export function getNetwork(params: URLSearchParams) {
  return params.has("testnet") ? "testnet" : "mainnet";
}

export function useNetwork(): { network: "mainnet" | "testnet" } {
  const [params] = useSearchParams();

  return {
    network: getNetwork(params),
  };
}
