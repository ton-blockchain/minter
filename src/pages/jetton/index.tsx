import { useEffect } from "react";
import { ScreenContent, Screen } from "components/Screen";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";
import { StyledContainer } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet";
import { Token } from "pages/jetton/dataRow/token";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { useTonAddress } from "@tonconnect/ui-react";

export const Jetton = () => {
  const actionInProgress = useRecoilValue(jettonActionsState);
  const { getJettonDetails } = useJettonStore();
  const { isAddressEmpty, jettonAddress } = useJettonAddress();
  const { showNotification } = useNotification();
  const address = useTonAddress();

  useEffect(() => {
    if (jettonAddress) {
      getJettonDetails();
    }
  }, [jettonAddress, address]);

  useEffect(() => {
    !isAddressEmpty && !jettonAddress && showNotification("Invalid jetton address", "error");
  }, []);

  return (
    <Screen>
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
