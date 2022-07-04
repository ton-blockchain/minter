import { Typography } from "@mui/material";
import BaseButton from "components/BaseButton";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { useState } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";

function RevokeOwnershipAction() {
  const [isLoading, setIsLoading] = useState(false);
  const { revokeAdminOwnership, jettonMaster, isAdmin } = useJettonStore();
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
      await revokeAdminOwnership(jettonMaster);
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
      <BaseButton onClick={onClick} loading={isLoading}>
        Revoke ownership
      </BaseButton>
    </>
  );
}

export default RevokeOwnershipAction;
