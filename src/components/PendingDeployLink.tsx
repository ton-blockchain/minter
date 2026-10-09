import { Link } from "@mui/material";
import { useDisplayAddresses } from "hooks/useDisplayAddresses";
import { formatAddress, Network, NETWORK_CONFIG } from "lib/network";

export function PendingDeployLink({ address, network }: { address: string; network: Network }) {
  const [displayAddress] = useDisplayAddresses([address], network);
  return (
    <Link
      href={`${NETWORK_CONFIG[network].explorer}/address/${
        displayAddress || formatAddress(address, network)
      }`}
      target="_blank">
      explorer
    </Link>
  );
}
