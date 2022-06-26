import { Box, Drawer, IconButton, styled } from "@mui/material";
import SearchInput from "components/SearchInput";
import { JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import { Link } from "react-router-dom";
import useConnectionStore from "store/connection-store/useConnectionStore";
import ConnectedSection from "./ConnectionSection";
import { NavbarProps } from "./types";
import githubIcon from "assets/github.svg";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const StyledMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    width: "calc(100vw - 60px)",
    maxWidth: 500,
    paddingTop: 50,
    gap: 20,
  },
}));

const StyledCustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginRight: 20,
  [theme.breakpoints.down("sm")]: {
    marginRight: 0,
  },
}));

const StyledCloseButton = styled(IconButton)({
  color: "#50A7EA",
  position: "absolute",
  right: 10,
  top: 10,
});

interface Props extends NavbarProps {
  closeMenu?: () => void;
  showMenu?: boolean;
 
}



const DesktopMenu = ({ customLink }: Props) => {
  return <NavbarMenu customLink={customLink} />;
};

const MobileMenu = ({ closeMenu, customLink, showMenu }: Props) => {
  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <StyledCloseButton onClick={closeMenu}>
        <CloseRoundedIcon style={{width: 30, height: 30}} />
      </StyledCloseButton>
      <NavbarMenu showMenu={showMenu} closeMenu={closeMenu} customLink={customLink} />
    </Drawer>
  );
};

const NavbarMenu = ({ customLink, closeMenu, showMenu }: Props) => {
  const { disconnect, address } = useConnectionStore();

  return (
    <StyledMenu onClick={closeMenu} className="navbar-menu">
      {customLink && (
        <StyledCustomLink to={customLink.path}>
          {customLink.text}
        </StyledCustomLink>
      )}
      <SearchInput />
      <IconButton href={JETTON_DEPLOYER_CONTRACTS_GITHUB} target="_blank">
        <img src={githubIcon} />
      </IconButton>
      {address && (
        <ConnectedSection address={address} disconnect={disconnect} />
      )}
    </StyledMenu>
  );
};

export { DesktopMenu, MobileMenu };
