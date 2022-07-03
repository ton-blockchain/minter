import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import BaseButton from "components/BaseButton";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Popup } from "components/Popup";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useJettonStore from "store/jetton-store/useJettonStore";
import { useState } from "react";
import TxLoader from "components/TxLoader";



function FaultyDeploy() {
  const { address } = useConnectionStore();
  const {
    fixFaultyDeploy,
    getJettonDetails,
    jettonMaster,
    isJettonDeployerFaultyOnChainData,
    isAdmin,
  } = useJettonStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!address) {
      return;
    }
    try {
      setIsLoading(true);
      await fixFaultyDeploy();
      await getJettonDetails(jettonMaster!, address);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Loading...</Typography>
      </TxLoader>
      <Popup
        open={!!isJettonDeployerFaultyOnChainData && isAdmin && !isLoading}
        onClose={() => {}}
      >
        <StyledWarningPopup>
          <Box className="header">
            <WarningAmberRoundedIcon />
            <Typography>Token metadata is invalid</Typography>
          </Box>
          <Box className="description">
            <Typography>
              This token was created with a previous faulty version of the tool.
              Press below to fix the metadata onchain. This will issue a
              transaction and keep the token’s original data.
            </Typography>
          </Box>
          <BaseButton onClick={onSubmit}>Submit</BaseButton>
        </StyledWarningPopup>
      </Popup>
    </>
  );
}

export default FaultyDeploy;

export const StyledWarningPopup = styled(Box)({
  maxWidth: 380,
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .header": {
    display: "flex",
    textAlign: "center",
    gap: 10,
    "* ": {
      color: "rgb(255, 152, 0)",
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
  },
});
