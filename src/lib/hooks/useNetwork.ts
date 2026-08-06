import { useSearchParams } from "react-router-dom";
import { getNetwork, Network } from "../network";

export { getNetwork } from "../network";

export function useNetwork(): { network: Network } {
  const [params] = useSearchParams();

  return {
    network: getNetwork(params),
  };
}
