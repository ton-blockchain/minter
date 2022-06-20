import { styled } from "@mui/material";
import { Box } from "@mui/system";
import BaseButton from "components/BaseButton";
import { Popup } from "components/Popup";
import { providers, Providers } from "lib/env-profiles";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import useConnectionStore from "store/connection-store/useConnectionStore";
import AdaptersList from "./AdaptersList";
import QR from "./ConnectQR";

const SyledContainer = styled(Box)({
  position: "relative",
  width: 420,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "white",
});

interface Props{
  open: boolean;
  onClose: () => void;
}

function ConnectModal({open, onClose}: Props) {
  const [sessionLink, setSessionLink] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const { connect, resetState } = useConnectionStore();

  const onSelect = async (provider: Providers) => {
    const onSessionLinkCreated = (value: string) => {
      if (isMobile) {
        // @ts-ignore
        window.location = value;
      } else {
        return setSessionLink(value);
      }
    };
    try {
      if (provider === Providers.TON_HUB) {
        !isMobile && setShowQr(true);
      }
      await connect(provider, onSessionLinkCreated);
      onClose();
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
    <Popup open={open} onClose={onClose}>
      <SyledContainer>
        <>
          {!sessionLink && (
            <AdaptersList
              adapters={providers}
              onClose={() => {}}
              open={!showQr}
              select={onSelect}
            />
          )}
          {showQr && <QR open={showQr} link={sessionLink} onClose={onCancel} />}
          {!showQr && sessionLink && (
            <BaseButton
              onClick={() => {
                window.open(sessionLink);
              }}
            >
              Connect to tonhub
            </BaseButton>
          )}
        </>
      </SyledContainer>
    </Popup>
  );
}

export default ConnectModal;
