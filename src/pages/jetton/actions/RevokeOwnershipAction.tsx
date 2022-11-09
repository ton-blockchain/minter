import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useContext } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { AppButton } from "components/appButton";
import { JettonActionsContext } from "pages/jetton/context/JettonActionsContext";

function RevokeOwnershipAction() {
  const { startAction, finishAction } = useContext(JettonActionsContext);
  const { jettonMaster, isAdmin, getJettonDetails, isMyWallet } = useJettonStore();
  const { showNotification } = useNotification();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onClick = async () => {
    try {
      if (!jettonMaster) {
        return;
      }
      startAction();
      await jettonDeployController.burnAdmin(
        Address.parse(jettonMaster),
        WalletConnection.getConnection(),
      );
      getJettonDetails();
      showNotification("Ownership revoked successfully", "success");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      finishAction();
    }
  };

  return (
    <>
      <AppButton transparent={true} onClick={onClick}>
        Revoke ownership
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
