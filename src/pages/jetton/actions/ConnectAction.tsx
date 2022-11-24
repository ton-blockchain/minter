import useConnectionStore from "store/connection-store/useConnectionStore";
import { AppButton } from "components/appButton";

function ConnectAction() {
  const { address, toggleConnect } = useConnectionStore();

  if (address) {
    return null;
  }

  return (
    <AppButton width={150} height={44} onClick={() => toggleConnect(true)}>
      Connect wallet
    </AppButton>
  );
}

export default ConnectAction;
