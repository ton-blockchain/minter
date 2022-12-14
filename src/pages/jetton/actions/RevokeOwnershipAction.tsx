import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { AppButton } from "components/appButton";
import { useSetRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useState } from "react";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { IconButton, Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import { Box } from "@mui/system";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function RevokeOwnershipAction() {
  const setActionInProgress = useSetRecoilState(jettonActionsState);
  const [showAlert, setShowAlert] = useState(false);
  const { jettonMaster, isAdmin, getJettonDetails, isMyWallet, symbol } = useJettonStore();
  const { showNotification } = useNotification();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onClick = async () => {
    setShowAlert(true);
  };

  const onSubmit = async () => {
    setShowAlert(false);
    try {
      if (!jettonMaster) {
        return;
      }
      setActionInProgress(true);
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
      setActionInProgress(false);
    }
  };

  return (
    <>
      <Popup open={showAlert} maxWidth={600} hideCloseButton onClose={() => setShowAlert(false)}>
        <Box mt={3} mx={3} sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <IconButton onClick={() => setShowAlert(false)} sx={{ padding: 0, color: "#000" }}>
            <CloseRoundedIcon style={{ width: 23, height: 23 }} />
          </IconButton>
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 20, marginBottom: 3 }}>
          Revoke Ownership
        </Typography>
        <Typography sx={{ alignSelf: "baseline" }}>
          This operation will revoke your admin rights of the <br /> token <b>{symbol}</b>. This
          means you will not be able to:
        </Typography>
        <ul style={{ alignSelf: "baseline", listStyleImage: `url(${bullet})`, paddingLeft: 20 }}>
          <li style={{ marginBottom: 15 }}>Change your logo</li>
          <li style={{ marginBottom: 15 }}>
            Mint more <b>{symbol}</b>
          </li>
          <li style={{ marginBottom: 15 }}>Change the token's name</li>
          <li style={{ marginBottom: 15 }}>Change the token's description</li>
        </ul>
        <Box sx={{ alignSelf: "baseline" }}>
          <Typography textAlign="left" sx={{ fontWeight: 700 }}>
            Revoke ownership only after all metadata has been finalized
          </Typography>
        </Box>
        <CenteringWrapper>
          <Box mr={4}>
            <AppButton transparent width={100} onClick={() => setShowAlert(false)}>
              Cancel
            </AppButton>
          </Box>
          <AppButton width={100} onClick={onSubmit}>
            Revoke
          </AppButton>
        </CenteringWrapper>
      </Popup>
      <AppButton transparent={true} onClick={onClick}>
        Revoke ownership
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
