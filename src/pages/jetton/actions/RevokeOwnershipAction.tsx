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
import { Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import error from "assets/icons/error-notification.svg";
import { Box } from "@mui/system";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

function RevokeOwnershipAction() {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { jettonMaster, isAdmin, getJettonDetails, isMyWallet, symbol, isImageBroken } =
    useJettonStore();
  const walletAddress = useTonAddress();
  const [tonconnect] = useTonConnectUI();
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
        tonconnect,
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
        <Box ml={3} mt={-1} mb={-0.6} sx={{ alignSelf: "baseline", color: "#464646" }}>
          <Typography
            sx={{
              color: "#161C28",
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 3.2,
              textAlign: "center",
            }}>
            Revoke Ownership
          </Typography>
          <Typography sx={{ fontWeight: 500, marginBottom: 2.2 }}>
            This operation will revoke your admin rights of the <br /> token{" "}
            <span style={{ fontWeight: 900 }}>{symbol}</span>. This means you will not be able to:
          </Typography>
          <ul
            style={{
              listStyleImage: `url(${bullet})`,
              paddingLeft: 20,
              fontWeight: 500,
              marginBottom: 0,
            }}>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>Change the token logo</span>
              {isImageBroken && (
                <CenteringWrapper ml="5px" sx={{ justifyContent: "flex-start" }}>
                  <img
                    src={error}
                    width={10}
                    height={10}
                    alt="Error icon"
                    style={{ marginRight: 5 }}
                  />
                  <span style={{ color: "#FC5656", fontSize: 12, fontWeight: 500 }}>
                    Logo is broken. You won’t be able to change this after revoking.
                  </span>
                </CenteringWrapper>
              )}
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>
                Mint more <span style={{ fontWeight: 900 }}>{symbol}</span>
              </span>
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>Change the token name</span>
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>Change the token description</span>
            </li>
          </ul>
          <Typography textAlign="left" sx={{ fontWeight: 700 }}>
            You should revoke ownership only after metadata has been finalized
          </Typography>
        </Box>
        <CenteringWrapper>
          <Box mr={4.2}>
            <AppButton transparent width={100} onClick={() => setShowAlert(false)}>
              Cancel
            </AppButton>
          </Box>
          <AppButton loading={actionInProgress} width={100} onClick={onSubmit}>
            Revoke
          </AppButton>
        </CenteringWrapper>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={onClick}>
        Revoke ownership
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
