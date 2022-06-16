import { AppBar, Button, Chip, IconButton, Link, Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import { EnvContext } from "App";
import { useContext } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "./BaseButton";
import githubIcon from "../github-mark.svg";

const StyledChip = styled(Chip)({
  width: 200,
  "& .MuiChip-label": {
    color: "white",
  },
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  maxWidth: 960,
  marginLeft: "auto",
  marginRight: "auto",
});

function Navbar() {
  const { disconnect, address, connect } = useConnectionStore();
  const { toggleConnectPopup } = useMainStore();
  const { isSandbox } = useContext(EnvContext);

  return (
    <AppBar component="nav" sx={isSandbox ? { background: "orange" } : {}}>
      <StyledToolbar>
        <Box sx={{ display: { sm: "block" } }}>
          {address ? (
            <Box>
              <StyledChip label={address} />
              <span
                style={{ marginLeft: 12, cursor: "pointer" }}
                onClick={() => disconnect()}
              >
                Disconnect
              </span>
            </Box>
          ) : (
            <BaseButton onClick={() => toggleConnectPopup(true)}>
              Connect
            </BaseButton>
          )}
        </Box>
        <Link
          href="https://github.com/ton-defi-org/jetton-deployer-contracts"
          target="_blank"
          sx={{marginLeft: 2}}
        >
          <img src={githubIcon} />
        </Link>
      </StyledToolbar>
    </AppBar>
  );
}

export default Navbar;
