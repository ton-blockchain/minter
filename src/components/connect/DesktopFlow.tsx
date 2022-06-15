import { Box, styled } from "@mui/system";
import { useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useMainStore from "store/main-store/useMainStore";
import AdaptersList from "./AdaptersList";
import QR from "./QR";
import { providers, Providers } from "lib/env-profiles";


const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
});

const DesktopFlow = () => {
  const [showQr, setShowQr] = useState(false);
  const { connect, resetState } = useConnectionStore();
  const { toggleConnectPopup } = useMainStore();
  const [sessionLink, setSessionLink] = useState<string | null>(null);

  const onSelect = async (provider: Providers) => {
    const onSessionLinkCreated = (value: string) => setSessionLink(value);
    try {
      if (provider === Providers.TON_HUB) {
        setShowQr(true);
      }
      await connect(provider, onSessionLinkCreated);
      toggleConnectPopup(false);
    } catch (error) {
      resetState();
    } finally {
      setShowQr(false);
      setSessionLink(null);
    }
  };

  const onCancel = () => {
    setShowQr(false);
    resetState();
  };

  return (
    <StyledContainer>
      <AdaptersList
        adapters={providers}
        onClose={() => {}}
        open={!showQr}
        select={onSelect}
      />
      <QR open={showQr} link={sessionLink} onClose={onCancel} />
    </StyledContainer>
  );
};

export default DesktopFlow;
