import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Popup } from "components/Popup";
import useJettonStore from "store/jetton-store/useJettonStore";
import { jettonDeployController } from "lib/deploy-controller";
import { Address } from "ton";
import { AppButton } from "components/appButton";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import useNotification from "hooks/useNotification";
import { useNetwork } from "lib/hooks/useNetwork";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "./actions/jettonActions";

function FaultyDeploy() {
  const {
    jettonMaster,
    getJettonDetails,
    isJettonDeployerFaultyOnChainData,
    isAdmin,
    symbol,
    name,
    description,
    rawJettonImage,
    rawJettonImageData,
    metadataError,
    decimals,
    persistenceType,
  } = useJettonStore();
  const [actionInProgress, setActionInProgress] = useRecoilState(jettonActionsState);
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const { showNotification } = useNotification();
  const { network } = useNetwork();
  const canFixMetadata =
    !metadataError && !rawJettonImageData && !!decimals && persistenceType === "onchain";

  const onSubmit = async () => {
    if (!address || !jettonMaster) {
      return;
    }
    try {
      if (!canFixMetadata) {
        throw new Error("Token metadata cannot be safely rewritten from the currently loaded data");
      }
      setActionInProgress(true);
      const outcome = await jettonDeployController.fixFaultyJetton(
        Address.parse(jettonMaster),
        {
          symbol,
          name,
          description,
          image: rawJettonImage,
          decimals,
        },
        tonConnectUI,
        address,
        network,
      );
      if (!(await getJettonDetails())) return;
      showNotification(
        outcome.status === "confirmed"
          ? "Token metadata fixed successfully"
          : "Metadata fix was submitted, but final confirmation is still pending. Check the explorer before retrying.",
        outcome.status === "confirmed" ? "success" : "warning",
      );
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Unable to fix token metadata",
        "error",
      );
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <>
      <Popup
        maxWidth={380}
        open={!!isJettonDeployerFaultyOnChainData && isAdmin && canFixMetadata}
        onClose={() => {}}
        hideCloseButton>
        <StyledWarningPopup>
          <Box className="header">
            <WarningAmberRoundedIcon />
            <Typography>Token metadata requires fix</Typography>
          </Box>
          <Box className="description">
            <Typography>
              This token was created with a previous faulty version of the deployer. Don’t worry,
              this can easily be fixed.
            </Typography>
            <br />
            <Typography>
              Click below to issue a fix transaction that will keep the token’s original data and
              fix the format.
            </Typography>
          </Box>
          <AppButton loading={actionInProgress} disabled={actionInProgress} onClick={onSubmit}>
            Submit
          </AppButton>
        </StyledWarningPopup>
      </Popup>
    </>
  );
}

export default FaultyDeploy;

export const StyledWarningPopup = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .header": {
    display: "flex",
    textAlign: "center",
    gap: 10,
    "* ": {
      color: "#d32f2f",
    },
    "& p": {
      fontSize: 22,
      fontWeight: 500,
    },
    "& svg": {
      position: "relative",
      top: 4,
    },
  },
  "& .description": {
    marginTop: 20,
    "& p": {
      fontSize: 16,
      textAlign: "center",
    },
  },
  "& .base-button": {
    marginTop: 40,
    height: 40,
    width: 200,
    background: "#d32f2f",
  },
});
