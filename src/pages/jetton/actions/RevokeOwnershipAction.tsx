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
import { Link, Typography } from "@mui/material";
import { Box } from "@mui/system";

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
      <Popup open={showAlert} maxWidth="80%" onClose={() => setShowAlert(false)}>
        <Typography className="title">Revoke Ownership</Typography>
        <Typography>
          This operation will revoke your admin rights of the token <b>{symbol}</b>. This means you
          will not be able to:
        </Typography>
        <ul
          style={{
            fontSize: 14,
          }}>
          <li>Change your logo URL</li>
          <li>
            Mint more <b>{symbol}</b>
          </li>
          <li>Change the token's name</li>
          <li>Change the token's description</li>
          <li>
            <Link
              sx={{ textDecoration: "none" }}
              href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices">
              Read more
            </Link>
          </li>
        </ul>
        <Box sx={{ alignSelf: "baseline" }}>
          <Typography textAlign="left">
            You should revoke ownership only after all metadata has been finalized.
          </Typography>
        </Box>
        <CenteringWrapper sx={{ alignSelf: "end" }}>
          <Box mr={1}>
            <AppButton onClick={() => setShowAlert(false)}>Cancel</AppButton>
          </Box>
          <AppButton onClick={onSubmit}>Submit</AppButton>
        </CenteringWrapper>
      </Popup>
      <AppButton transparent={true} onClick={onClick}>
        Revoke ownership
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
