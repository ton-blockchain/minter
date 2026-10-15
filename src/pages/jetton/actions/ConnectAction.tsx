import { useIsConnectionRestored, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { AppButton } from "components/appButton";

function ConnectAction() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const connectionRestored = useIsConnectionRestored();

  if (address) return null;

  return (
    <AppButton
      disabled={!connectionRestored}
      onClick={() => {
        if (connectionRestored && !tonConnectUI.connected) {
          tonConnectUI.openModal();
        }
      }}>
      Connect Wallet
    </AppButton>
  );
}

export default ConnectAction;
