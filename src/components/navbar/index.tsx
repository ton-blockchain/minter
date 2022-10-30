import { AppBar, IconButton, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { APP_GRID } from "consts";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { DesktopMenu, MobileMenu } from "./Menu";
import Logo from "./Logo";
import SearchInput from "components/navbar/SearchInput";
import theme from "theme";

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
  height: 140,
  background: "white",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0px 2px 16px rgba(114, 138, 150, 0.08)",
  borderRadius: "0px 0px 48px 48px",
  [theme.breakpoints.down("md")]: {
    paddingTop: 10,
  },
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    background: "white",
    zIndex: 99,
    left: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
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
      <Box
        sx={{
          maxWidth: APP_GRID,
          width: "100%",
          margin: "0 auto",
          maxHeight: 75,
          [theme.breakpoints.down("lg")]: {
            width: "calc(100% - 50px)",
          },
        }}>
        <StyledToolbar>
          {!matches && (
            <IconButton onClick={() => setMobileMenu(true)}>
              <MenuRoundedIcon style={{ width: 40, height: 40, color: "#50A7EA" }} />
            </IconButton>
          )}
          <Logo />
          {matches && <DesktopMenu customLink={customLink} />}
        </StyledToolbar>
        <Box>
          <SearchInput closeMenu={() => setMobileMenu(false)} />
        </Box>
        <MobileMenu
          showMenu={mobileMenu && !matches}
          customLink={customLink}
          closeMenu={() => setMobileMenu(false)}
        />
      </Box>
    </StyledAppBar>
  );
}

export default Navbar;
