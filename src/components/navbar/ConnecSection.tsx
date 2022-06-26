import {
  Box,
  ClickAwayListener,
  Fade,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import WalletImg from "assets/wallet.svg";
import useConnectionStore from "store/connection-store/useConnectionStore";

const StyledContainer = styled(Box)({
  maxWidth: 156,
  position: "relative",
  background: "#50A7EA",
  height: "100%",
  minHeight: 35,
  borderRadius: 20,

  "& .MuiButtonBase-root": {
    padding: 0,
  },
  "& p": {
    fontSize: 12,
    maxWidth: 100,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const StyledConnected = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  position: "relative",
  padding: '0px 28px 0px 15px'
});

const StyledConnect = styled("div")({
  paddingLeft: 30,
  paddingRight: 30,
  cursor: "pointer",
  width:'100%',
  height: '100%',
  display:'flex',
  alignItems:'center'
});

const StyledDisconnect = styled("button")({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  right: 0,
  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
  background: "white",
  border: "none",
  height: 35,
  width: "100%",
  borderRadius: 20,
  gap: 10,
  justifyContent: "center",
  top: "calc(100% + 10px)",
  cursor: "pointer",
  "& p": {
    fontSize: 12,
  },
});

const StyledDisconnectToggle = styled(IconButton)({
  position: "absolute",
  right: 8,
});

const ConnecSection = () => {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { disconnect, address, toggleConnect } = useConnectionStore();

  const onDisconnect = () => {
    setShowDisconnect(false);
    disconnect();
  };

  const onClickAway = () => {
    if (showDisconnect) {
      setShowDisconnect(false);
    }
  };

  return (
    <StyledContainer className="connected-section">
      <>
        {address ? (
          <StyledConnected>
            <img src={WalletImg} />
            <Tooltip title={address}>
              <Typography style={{ color: "white" }}>{address}</Typography>
            </Tooltip>
            <StyledDisconnectToggle onClick={() => setShowDisconnect(true)}>
              <ArrowDropDownIcon />
            </StyledDisconnectToggle>
          </StyledConnected>
        ) : (
          <StyledConnect onClick={() => toggleConnect(true)}>
            <Typography>Connect</Typography>
          </StyledConnect>
        )}
      </>
      {showDisconnect && (
        <ClickAwayListener onClickAway={onClickAway}>
          <StyledDisconnect onClick={onDisconnect}>
            <PowerSettingsNewIcon style={{ width: 15, height: 15 }} />
            <Typography>Disconnect</Typography>
          </StyledDisconnect>
        </ClickAwayListener>
      )}
    </StyledContainer>
  );
};

export default ConnecSection;
