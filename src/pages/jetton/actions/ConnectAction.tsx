import useConnectionStore from "store/connection-store/useConnectionStore";
import { AppButton } from "components/appButton";

function ConnectAction() {
  const { address, toggleConnect } = useConnectionStore();

  if (address) {
    return null;
  }

  return (
    <AppButton transparent onClick={() => toggleConnect(true)} background="#0088CC">
      Connect wallet
    </AppButton>
  );
}

export default ConnectAction;
