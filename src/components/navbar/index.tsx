import { AppBar, IconButton, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { EnvContext } from "App";
import { useContext, useState } from "react";
import { APP_DISPLAY_NAME, APP_GRID, ROUTES } from "consts";
import LogoImg from "assets/logo.svg";
import { useNavigate } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { DesktopMenu, MobileMenu } from "./Menu";

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems:'center',
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    maxWidth: APP_GRID,
    background: 'transparent',
    boxShadow: "none",
    paddingTop: 40,
    paddingBottom: 20,
    [theme.breakpoints.down('md')]: {
      paddingTop: 10
    }

  }))

const StyledLogo = styled(Box)(({theme}) => ({
  display: "flex",
  color: "#6D6D6D",
  alignItems: "center",
  gap: 4,
  "& h4": {
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 700,
  },
  [theme.breakpoints.down('sm')]: {
    "& img":{
      width:40
    },
    "& h4": {
      fontSize: 15,
    }
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
  const navigate = useNavigate();
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
        <StyledLogo onClick={() => navigate(ROUTES.deployer)}>
          <IconButton>
            <img src={LogoImg} />
          </IconButton>
          <Box>
            <Typography variant="h4">{APP_DISPLAY_NAME}</Typography>
          </Box>
        </StyledLogo>
        {matches && <DesktopMenu customLink={customLink} />}
      </StyledToolbar>
      <MobileMenu showMenu={mobileMenu && !matches} customLink={customLink} closeMenu={() => setMobileMenu(false)} />
    </StyledAppBar>
  );
}

export default Navbar;
