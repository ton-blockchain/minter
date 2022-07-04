import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { delay } from "@ton-defi.org/ton-connection";
import { Popup } from "components/Popup";
import { providers, Providers } from "lib/env-profiles";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import useConnectionStore from "store/connection-store/useConnectionStore";
import AdaptersList from "./AdaptersList";
import QR from "./ConnectQR";

const SyledContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
  width: "fit-content",
});

function ConnectPopup() {
  const [sessionLink, setSessionLink] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const { connect, resetState, toggleConnect, showConnect } =
    useConnectionStore();

  const onSelect = async (provider: Providers) => {
    setSessionLink(null)
    const onSessionLinkCreated = (value: string) => {
      if (isMobile) {
        // @ts-ignore
        window.location = value;
      } else {
        setSessionLink(value);
      }
    };
    try {
      console.log(provider);

      if (provider === Providers.TON_HUB && !isMobile) {
        setShowQr(true);
      }
      await connect(provider, onSessionLinkCreated);
      toggleConnect(false);
    } catch (error) {
      resetState();
    } finally {
      setShowQr(false);
      setSessionLink(null);
    }
  };



  const onCancel = () => {
    setShowQr(false);
  };

  const close = async () => {
    toggleConnect(false);
    await delay(200);
    setShowQr(false);
    setSessionLink(null);
  };

  return (
    <Popup open={showConnect} onClose={close} maxWidth={400}>
      <SyledContainer>
        <AdaptersList
          adapters={providers}
          onClose={close}
          open={!showQr}
          select={onSelect}
        />
        <QR open={showQr} link={sessionLink} onClose={onCancel} />
      </SyledContainer>
    </Popup>
  );
}

export default ConnectPopup;
