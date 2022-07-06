import { AppBar, IconButton, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import {  APP_GRID } from "consts";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { DesktopMenu, MobileMenu } from "./Menu";
import Logo from "./Logo";

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  maxWidth: APP_GRID,
  background: "transparent",
  boxShadow: "none",
  paddingTop: 40,
  paddingBottom: 20,
  [theme.breakpoints.down("md")]: {
    paddingTop: 10,
  },
  [theme.breakpoints.down('sm')]:{
  position:'fixed',
  background:'white',
  zIndex: 99,
  left:0,
  paddingLeft:15,
  paddingRight: 15,
  paddingBottom: 10,
  }
}));



interface Props {
  customLink?: {
    text: string;
    path: string;
  };
}

function Navbar({ customLink }: Props) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {!matches && (
          <IconButton onClick={() => setMobileMenu(true)}>
            <MenuRoundedIcon
              style={{ width: 40, height: 40, color: "#50A7EA" }}
            />
          </IconButton>
        )}
        <Logo />
        {matches && <DesktopMenu customLink={customLink} />}
      </StyledToolbar>
      <MobileMenu
        showMenu={mobileMenu && !matches}
        customLink={customLink}
        closeMenu={() => setMobileMenu(false)}
      />
    </StyledAppBar>
  );
}

export default Navbar;
