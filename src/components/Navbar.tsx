import {
  AppBar,
  Button,
  Chip,
  ClickAwayListener,
  Fade,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { EnvContext } from "App";
import { useContext, useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import githubIcon from "assets/github.svg";
import { APP_DISPLAY_NAME, APP_GRID, JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LogoImg from "assets/logo.svg";
import WalletImg from "assets/wallet.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const StyledToolbar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
});

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

const StyledRightSide = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 10,
});

const StyledAppBar = styled(AppBar)(
  ({ isSandBox }: { isSandBox: boolean }) => ({
    maxWidth: APP_GRID,
    background: isSandBox ? "orange" : "transparent",

    boxShadow: "none",
    paddingTop: 40,
    paddingBottom: 20,
  })
);

const StyledLogo = styled(Box)({
  display: "flex",
  color: "#6D6D6D",
  alignItems: "center",
  gap: 4,
  "& h4": {
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 700,
  },
});

function Navbar() {
  const { disconnect, address } = useConnectionStore();
  const { isSandbox } = useContext(EnvContext);

  return (
    <StyledAppBar position="static" isSandBox={isSandbox}>
      <StyledToolbar>
        <StyledLogo>
          <IconButton>
            <img src={LogoImg} />
          </IconButton>
          <Box>
            <Typography variant="h4">{APP_DISPLAY_NAME}</Typography>
          </Box>
        </StyledLogo>
        <StyledRightSide>
        <IconButton href={JETTON_DEPLOYER_CONTRACTS_GITHUB} target="_blank">
            <img src={githubIcon} />
          </IconButton>
          {address && (
            <ConnectedSection address={address} disconnect={disconnect} />
          )}
          
        </StyledRightSide>
      </StyledToolbar>
    </StyledAppBar>
  );
}

interface ConnectedSectionProps {
  address: string;
  disconnect: () => void;
}

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
            <Typography>{address}</Typography>
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

export default Navbar;
