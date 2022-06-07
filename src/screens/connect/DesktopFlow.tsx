import { Box, styled } from "@mui/system";
import { APP_NAME, ROUTES } from "consts";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { adapters, createWalletSession } from "tonstarter-contracts";
import { Adapters } from "tonstarter-contracts/lib/wallets/types";
import AdaptersList from "./AdaptersList";
import QR from "./QR";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
});



const DesktopFlow = () => {
  const navigate = useNavigate();
  const [showQr, setShowQr] = useState(false);
  const { address, onWalletConnect, onSessionCreated, resetState, sessionLink } =
    useConnectionStore();

  useEffect(() => {
    if (address) {
      navigate(ROUTES.deployer);
    }
  }, [address]);

  const onSelect = async (adapter: Adapters) => {
    try {
      const _session = await createWalletSession(
        adapter,
        APP_NAME,
        onWalletConnect
      );
      
      onSessionCreated(_session, adapter);

      if (adapter === Adapters.TON_HUB) {
        setShowQr(true);
      }
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
