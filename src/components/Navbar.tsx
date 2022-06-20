import {
  AppBar,
  Chip,
  ClickAwayListener,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { EnvContext } from "App";
import { useContext, useState } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import githubIcon from "../github-mark.svg";
import { APP_GRID, JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
const StyledChip = styled(Chip)({
  width: 200,
  "& .MuiChip-label": {
    color: "white",
  },
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const StyledLeftSide = styled(Box)({});

const StyledRightSide = styled(Box)({
  display:'flex',
  alignItems:'center',
  gap:10
});

const StyledAppBar = styled(AppBar)(
  ({ isSandBox }: { isSandBox: boolean }) => ({
    maxWidth: APP_GRID,
    background: isSandBox ? "orange" : "",
    left: "50%",
    transform: "translate(-50%)",
  })
);

function Navbar() {
  const { disconnect, address } = useConnectionStore();
  const { isSandbox } = useContext(EnvContext);

  return (
    <StyledAppBar isSandBox={isSandbox}>
      <StyledToolbar>
        <StyledLeftSide>
          <Typography>Jetton Deployer</Typography>
        </StyledLeftSide>
        <StyledRightSide>
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
  position:'relative',
  display:'flex',
  alignItems:'center',
  gap: 10
});

const ConnectedSection = ({ address, disconnect }: ConnectedSectionProps) => {
  return (
   
      <StyledConnectionSection>
        <Tooltip title='Disconnect'>
        <IconButton onClick={disconnect}>
        <PowerSettingsNewIcon />
        </IconButton>
        </Tooltip>
        <Tooltip title={address}>
        <StyledChip
          label={address}
        />
        </Tooltip>
        {/* {showDisconnectButton && (
          <ClickAwayListener onClickAway={() => setShowDisconnectButton(false)}>
            <StyledDisconnectButton>
            <BaseButton>Disconnect</BaseButton>
          </StyledDisconnectButton>
          </ClickAwayListener>
        )} */}
      </StyledConnectionSection>
   
  );
};

export default Navbar;
