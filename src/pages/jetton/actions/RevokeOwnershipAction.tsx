import { Typography } from "@mui/material";
import BaseButton from "components/BaseButton";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";

function RevokeOwnershipAction() {
  const [isLoading, setIsLoading] = useState(false);
  const { jettonMaster, isAdmin, getJettonDetails } = useJettonStore();
  const { showNotification } = useNotification();

  if (!isAdmin) {
    return null;
  }

  const onClick = async () => {
    try {
      if (!jettonMaster) {
        return;
      }
      setIsLoading(true);
      await jettonDeployController.burnAdmin(
        Address.parse(jettonMaster),
        WalletConnection.getConnection()
      );
      getJettonDetails();
      showNotification("Ownership revoked successfully", "success");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Revoking ownership...</Typography>
      </TxLoader>
      <BaseButton transparent={true} onClick={onClick} loading={isLoading}>
        Revoke ownership
      </BaseButton>
    </>
  );
}

export default RevokeOwnershipAction;
