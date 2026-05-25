import { useTonAddress } from "@tonconnect/ui-react";
import { Screen, ScreenContent } from "components/Screen";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { Token } from "pages/jetton/dataRow/token/Token";
import { StyledContainer, StyledBlock } from "pages/jetton/styled";
import { Wallet } from "pages/jetton/wallet/Wallet";
import { useEffect } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import FaultyDeploy from "./FaultyDeploy";
import { Box, Typography } from "@mui/material";
import { AppButton } from "components/appButton";

export const Jetton = () => {
  const { getJettonDetails, jettonMaster, name, symbol } = useJettonStore();
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

          {jettonMaster && (
            <Box sx={{ display: "flex", gap: 1, flexDirection: "row", flexWrap: "wrap" }}>
              <AppButton
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/jetton/${jettonMaster}`);
                  showNotification("Link copied!", "success");
                }}
                height={40}
                transparent>
                Copy link
              </AppButton>
              <AppButton
                onClick={() => {
                  const text = `Check out ${name} (${symbol}) on TON Minter`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      text,
                    )}&url=${encodeURIComponent(
                      `${window.location.origin}/jetton/${jettonMaster}`,
                    )}`,
                    "_blank",
                  );
                }}
                height={40}
                transparent>
                Twitter
              </AppButton>
              <AppButton
                onClick={() => {
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(
                      `${window.location.origin}/jetton/${jettonMaster}`,
                    )}&text=${encodeURIComponent(`${name} (${symbol})`)}`,
                    "_blank",
                  );
                }}
                height={40}
                transparent>
                Telegram
              </AppButton>
            </Box>
          )}
        </StyledContainer>
      </ScreenContent>
    </Screen>
  );
};
