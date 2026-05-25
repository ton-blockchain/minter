import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { AppButton } from "components/appButton";
import { useState } from "react";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { Typography, Box } from "@mui/material";
import error from "assets/icons/error-notification.svg";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

function RevokeOwnershipAction() {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { jettonMaster, isAdmin, getJettonDetails, isMyWallet, symbol, isImageBroken } =
    useJettonStore();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { showNotification } = useNotification();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onSubmit = async () => {
    setShowAlert(false);
    try {
      if (!jettonMaster) return;
      setActionInProgress(true);
      await jettonDeployController.burnAdmin(
        Address.parse(jettonMaster),
        tonConnectUI,
        walletAddress,
      );
      getJettonDetails();
      showNotification("Ownership revoked successfully", "success");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <>
      <Popup open={showAlert} maxWidth={600} onClose={() => setShowAlert(false)}>
        <Box sx={{ width: "100%", px: { xs: 1, sm: 3 } }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 20,
              mb: 3,
              textAlign: "center",
            }}>
            Revoke Ownership
          </Typography>
          <Typography sx={{ fontWeight: 500, mb: 2, color: "#93A5B8", fontSize: 14 }}>
            This operation will revoke your admin rights of the token{" "}
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{symbol}</span>. This means you will
            not be able to:
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, mb: 2, color: "#93A5B8", fontSize: 14, pr: 2 }}>
            <li style={{ marginBottom: 10, paddingLeft: 5 }}>
              Change the token logo
              {isImageBroken && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <img src={error} width={12} height={12} alt="Error" style={{ marginRight: 5 }} />
                  <span style={{ color: "#FC5656", fontSize: 12, fontWeight: 500 }}>
                    Logo is broken. You won't be able to change this after revoking.
                  </span>
                </Box>
              )}
            </li>
            <li style={{ marginBottom: 10, paddingLeft: 5 }}>
              Mint more <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{symbol}</span>
            </li>
            <li style={{ marginBottom: 10, paddingLeft: 5 }}>Change the token name</li>
            <li style={{ marginBottom: 10, paddingLeft: 5 }}>Change the token description</li>
          </Box>
          <Typography sx={{ fontWeight: 600, color: "#FFFFFF", fontSize: 14, mb: 3 }}>
            You should revoke ownership only after metadata has been finalized
          </Typography>
        </Box>
        <CenteringWrapper sx={{ gap: 2, pb: 1 }}>
          <AppButton transparent width={100} onClick={() => setShowAlert(false)}>
            Cancel
          </AppButton>
          <AppButton loading={actionInProgress} width={100} onClick={onSubmit} background="#ef5350">
            Revoke
          </AppButton>
        </CenteringWrapper>
      </Popup>
      <AppButton loading={actionInProgress} transparent onClick={() => setShowAlert(true)}>
        Revoke Own...
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
