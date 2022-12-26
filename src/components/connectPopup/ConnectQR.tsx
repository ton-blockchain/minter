import { Box } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import TonhubQr from "assets/icons/tonhub-qr.png";
import Header from "./Header";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledQrBox = styled(Box)({
  width: 260,
  height: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface Props {
  onClose: () => void;
  link: string | null;
  open: boolean;
  walletName: string;
}

function QR({ onClose, link, open, walletName }: Props) {
  if (!open) {
    return null;
  }

  return (
    <Fade in>
      <StyledContainer>
        <Header title={`Connect to ${walletName}`} onClose={onClose} />
        <StyledQrBox>
          {link ? (
            <span>
              <QRCodeSVG
                value={link}
                size={260}
                bgColor={"#ffffff"}
                fgColor={"#002457"}
                level={"L"}
                includeMargin={false}
                imageSettings={{
                  src: TonhubQr,
                  height: 50,
                  width: 50,
                  excavate: true,
                }}
              />
            </span>
          ) : (
            <CircularProgress />
          )}
        </StyledQrBox>
      </StyledContainer>
    </Fade>
  );
}

export default QR;
