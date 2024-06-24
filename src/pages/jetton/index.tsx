import { useTonAddress } from "@tonconnect/ui-react";
import { Screen, ScreenContent } from "components/Screen";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { Token } from "pages/jetton/dataRow/token";
import { StyledContainer } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet";
import { useEffect } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";

export const Jetton = () => {
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
