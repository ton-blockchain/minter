import { Box, styled } from "@mui/system";
import { APP_NAME } from "consts";
import { useEffect } from "react";
import { useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useMainStore from "store/main-store/useMainStore";
import AdaptersList from "./AdaptersList";
import QR from "./QR";
import { getTonCon } from "./my-ton-con-service";

// todo sy
const adapters = [{ type: "tonhub" }, { type: "ton_wallet" }];

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
});

const DesktopFlow = () => {
  const [showQr, setShowQr] = useState(false);
  const {
    address,
    onWalletConnect,
    onSessionCreated,
    resetState,
    sessionLink,
  } = useConnectionStore();
  const { toggleConnectPopup } = useMainStore();

  useEffect(() => {
    if (address) {
      toggleConnectPopup(false);
    }
  }, [address]);

  // TODO sy string
  const onSelect = async (adapter: string) => {
    try {
      const con = getTonCon(adapter, setShowQr.bind(this, true));
      const wallet = await con.connect();

      onWalletConnect(wallet);

      // persist chosen adapter? todo sy

    } catch (error) {
      resetState();
      setShowQr(false);
    }
  };

  const cancel = () => {
    setShowQr(false);
    resetState();
  };

  return (
    <StyledContainer>
      <AdaptersList
        adapters={adapters}
        onClose={() => {}}
        open={!showQr}
        select={onSelect}
      />
      <QR open={showQr} link={sessionLink} onClose={cancel} />
    </StyledContainer>
  );
};

export default DesktopFlow;
