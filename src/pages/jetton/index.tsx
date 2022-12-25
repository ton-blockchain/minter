import { useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { ScreenContent, Screen } from "components/Screen";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";
import { StyledContainer } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet";
import { Token } from "pages/jetton/dataRow/token";
import TxLoader from "components/TxLoader";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useJettonAddress } from "hooks/useJettonAddress";

export const Jetton = () => {
  const { address, isConnecting } = useConnectionStore();
  const actionInProgress = useRecoilValue(jettonActionsState);
  const { getJettonDetails } = useJettonStore();
  const { jettonAddress } = useJettonAddress();

  useEffect(() => {
    if (jettonAddress && !isConnecting) {
      getJettonDetails();
    }
  }, [jettonAddress, getJettonDetails, address, isConnecting]);

  return (
    <Screen>
      <TxLoader open={actionInProgress}>
        <Typography>Loading... Check your wallet for a pending transaction</Typography>
      </TxLoader>
      <FaultyDeploy />
      <ScreenContent>
        <StyledContainer>
          <Token />
          <Wallet />
        </StyledContainer>
      </ScreenContent>
    </Screen>
  );
};
