import { useTonAddress } from "@tonconnect/ui-react";
import { Screen, ScreenContent } from "components/Screen";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { Token } from "pages/jetton/dataRow/token";
import { StyledContainer } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";

export const Jetton = () => {
  const { getJettonDetails, invalidateJettonDetails } = useJettonStore();
  const { isAddressEmpty, jettonAddress } = useJettonAddress();
  const { showNotification } = useNotification();
  const address = useTonAddress();
  const [params] = useSearchParams();
  const selectedWalletAddress = params.get("address");

  useEffect(() => {
    if (jettonAddress) {
      getJettonDetails();
      return invalidateJettonDetails;
    }
    invalidateJettonDetails();
  }, [jettonAddress, address, selectedWalletAddress, getJettonDetails, invalidateJettonDetails]);

  useEffect(() => {
    !isAddressEmpty && !jettonAddress && showNotification("Invalid jetton address", "error");
  }, [isAddressEmpty, jettonAddress, showNotification]);

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
