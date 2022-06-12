import { Box } from "@mui/material";
import QRCode from "react-qr-code";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/system';

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  background: "white",
  width: "260px",
  height: "260px",
});

const StyledQrBox = styled(Box)({
 
  width:'100%',
  height:'100%',
  display: 'flex',
  alignItems:'center',
  justifyContent:'center'

});

interface Props {
  onClose: () => void;
  link?: string;
  open: boolean;
}

function QR({ onClose, link, open }: Props) {
  if (!open) {
    return null;
  }
  
  
  return (
    <StyledContainer>
      <StyledQrBox>
        {link ? (
          <Fade in={true}>
            <Box>
              <QRCode   value={link} />
            </Box>
          </Fade>
        ) : (
          <CircularProgress  />
        )}
      </StyledQrBox>
    </StyledContainer>
  );
}

export default QR;
