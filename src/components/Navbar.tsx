import { AppBar, Button, Chip, IconButton, Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "./BaseButton";


const StyledChip = styled(Chip)({
  width: 200,
  "& .MuiChip-label":{
    color:'white',
  }
})

const StyledToolbar = styled(Toolbar)({
  display:'flex',
  justifyContent:'flex-end',
  width:'100%',
  maxWidth: 960,
  marginLeft:'auto',
  marginRight:'auto'
})

function Navbar() {
  const { disconnect, address, connect } = useConnectionStore();
  const { toggleConnectPopup } = useMainStore();
  return (
    <AppBar component="nav">
      <StyledToolbar>
       
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {address ? (
            <StyledChip label={address} />
          ) : (
            <BaseButton onClick={() => toggleConnectPopup(true)}>
              Connect
            </BaseButton>
          )}
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

export default Navbar;
