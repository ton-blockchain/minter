import { AppBar, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { EnvContext } from "App";
import { useContext, useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import githubIcon from "assets/github.svg";
import { APP_GRID, JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LogoImg from "assets/logo.svg";

const StyledChip = styled(Chip)({
  width: 200,
  background: "#4BA0E3",
  "& .MuiChip-label": {
    color: "white",
  },
});

const StyledToolbar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
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
  gap: 11,
  "& p": {
    fontSize: 18,
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
          <Typography>Jettonic</Typography>
        </StyledLogo>
        <StyledRightSide>
          <BetaIndicator />
          {address && (
            <ConnectedSection address={address} disconnect={disconnect} />
          )}
          <IconButton href={JETTON_DEPLOYER_CONTRACTS_GITHUB} target="_blank">
            <img src={githubIcon} />
          </IconButton>
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

const StyledBetaIndicator = styled(Box)({
  border: "2px solid #50A7EA",
  borderRadius: 20,
  padding: "5px 20px",
  "& p": {
    color: "#50A7EA",
    fontSize: 16,
    fontWeight: 500,
  },
});

const BetaIndicator = () => {
  return (
    <StyledBetaIndicator>
      <Typography>Beta</Typography>
    </StyledBetaIndicator>
  );
};

const ConnectedSection = ({ address, disconnect }: ConnectedSectionProps) => {
  return (
    <StyledConnectionSection>
      <Tooltip title="Disconnect">
        <IconButton onClick={disconnect}>
          <PowerSettingsNewIcon style={{ color: "#4BA0E3" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title={address}>
        <StyledChip label={address} />
      </Tooltip>
    </StyledConnectionSection>
  );
};

export default Navbar;
