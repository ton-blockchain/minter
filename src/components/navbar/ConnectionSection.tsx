import { Box, ClickAwayListener, Fade, IconButton, styled, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import WalletImg from "assets/wallet.svg";


interface ConnectedSectionProps {
    address: string;
    disconnect: () => void;
  }

  const StyledAddressContainer = styled(Box)({
    position: "relative",
    background: "#50A7EA",
    borderRadius: 20,
    padding: "5px 15px",
  });
  
  const StyledAddress = styled(Box)({
    display: "flex",
    alignItems: "center",
  
    "& .MuiButtonBase-root": {
      padding: 0,
    },
    "& p": {
      fontSize: 12,
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginLeft: 10,
    },
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
    width: 122,
    borderRadius: 20,
    gap: 10,
    justifyContent: "center",
    top: "calc(100% + 10px)",
    cursor: "pointer",
    "& p": {
      fontSize: 12,
    },
  });

  
  
  const StyledConnectionSection = styled(Box)({
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 10,
  });
  
  const ConnectedSection = ({ address, disconnect }: ConnectedSectionProps) => {
    const [showDisconnect, setShowDisconnect] = useState(false);
  
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
      <StyledConnectionSection>
        <StyledAddressContainer>
          <StyledAddress>
            <img src={WalletImg} />
            <Tooltip title={address}>
              <Typography style={{ color: "white" }}>{address}</Typography>
            </Tooltip>
            <IconButton onClick={() => setShowDisconnect(true)}>
              <ArrowDropDownIcon />
            </IconButton>
          </StyledAddress>
          {showDisconnect && (
            <Fade in={true}>
              <span>
                <ClickAwayListener onClickAway={onClickAway}>
                  <StyledDisconnect onClick={onDisconnect}>
                    <PowerSettingsNewIcon style={{ width: 15, height: 15 }} />
                    <Typography>Disconnect</Typography>
                  </StyledDisconnect>
                </ClickAwayListener>
              </span>
            </Fade>
          )}
        </StyledAddressContainer>
      </StyledConnectionSection>
    );
  };
  

  export default ConnectedSection