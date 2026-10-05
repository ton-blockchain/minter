import { Link } from "@mui/material";
import { useDisplayAddresses } from "hooks/useDisplayAddresses";
import { Network, NETWORK_CONFIG } from "lib/network";

export function PendingDeployLink({ address, network }: { address: string; network: Network }) {
  const [displayAddress] = useDisplayAddresses([address], network);
  return displayAddress ? (
    <Link href={`${NETWORK_CONFIG[network].explorer}/address/${displayAddress}`} target="_blank">
      explorer
    </Link>
  ) : (
    <>explorer (loading…)</>
  );
}
