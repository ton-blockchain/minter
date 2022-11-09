import { useContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useParams } from "react-router-dom";
import { ScreenContent, Screen } from "components/Screen";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";
import { StyledContainer } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet";
import { Token } from "pages/jetton/dataRow/token";
import {
  JettonActionsContext,
  JettonActionContextWrapper,
} from "pages/jetton/context/JettonActionsContext";
import TxLoader from "components/TxLoader";
import { Typography } from "@mui/material";

const Jetton = () => {
  const { id }: { id?: string } = useParams();
  const { address, isConnecting } = useConnectionStore();
  const { actionInProgress } = useContext(JettonActionsContext);
  const { getJettonDetails } = useJettonStore();

  useEffect(() => {
    if (id && !isConnecting) {
      getJettonDetails();
    }
  }, [id, getJettonDetails, address, isConnecting]);

  return (
    <Screen>
      <TxLoader open={actionInProgress}>
        <Typography>Loading...</Typography>
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

export const JettonPage = () => (
  <JettonActionContextWrapper>
    <Jetton />
  </JettonActionContextWrapper>
);
