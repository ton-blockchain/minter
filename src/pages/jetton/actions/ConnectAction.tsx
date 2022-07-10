import BaseButton from "components/BaseButton";
import useConnectionStore from "store/connection-store/useConnectionStore";

function ConnectAction() {
  const { address, toggleConnect } = useConnectionStore();

  if (address) {
    return null;
  }

  return (
    <BaseButton transparent onClick={() => toggleConnect(true)}>
      Connect wallet
    </BaseButton>
  );
}

export default ConnectAction;
