import { Box, styled } from "@mui/system";
import { APP_NAME } from "consts";
import { useEffect } from "react";
import { useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useMainStore from "store/main-store/useMainStore";
import { Adapters } from "jetton-deployer-contracts/lib/wallets/types";
import AdaptersList from "./AdaptersList";
import QR from "./QR";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
});



const DesktopFlow = () => {
  const [showQr, setShowQr] = useState(false);
  const { address, onWalletConnect, onSessionCreated, resetState, sessionLink } =
    useConnectionStore();
    const {toggleConnectPopup} = useMainStore()

  useEffect(() => {
    if (address) {
      toggleConnectPopup(false)
    }
  }, [address]);

  const onSelect = async (adapter: Adapters) => {
    // try {
    //   const _session = await createWalletSession(
    //     adapter,
    //     APP_NAME,
    //     onWalletConnect
    //   );
      
    //   onSessionCreated(_session, adapter);

    //   if (adapter === Adapters.TON_HUB) {
    //     setShowQr(true);
    //   }
    // } catch (error) {
    //   resetState();
    //   setShowQr(false);
    // }
  };

  const cancel = () => {
    setShowQr(false);
    resetState();
  };

  return (
    <StyledContainer>
      {/* <AdaptersList
        adapters={adapters}
        onClose={() => {}}
        open={!showQr}
        select={onSelect}
      /> */}
      <QR open={showQr} link={sessionLink} onClose={cancel} />
    </StyledContainer>
  );
};

export default DesktopFlow;
