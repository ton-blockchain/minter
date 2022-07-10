import { Box, Drawer, IconButton, styled } from "@mui/material";
import { JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import { Link } from "react-router-dom";
import ConnecSection from "./ConnecSection";
import { NavbarProps } from "./types";
import githubIcon from "assets/github.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BaseButton from "components/BaseButton";
import JettonImg from "assets/jetton.svg";
import Logo from "./Logo";
import SearchInput from "./SearchInput";

const StyledCustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  height: "100%",
  "& .base-button": {
    borderRadius: 20,
    fontSize: 12,
  },

  [theme.breakpoints.down("sm")]: {
    marginRight: 0,
    height: 35,
  },
}));

const StyledCloseButton = styled(IconButton)({
  color: "#50A7EA",
  position: "absolute",
  right: 10,
  top: 10,
});

const StyledDrawerContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 60,
  "& .logo": {
    flexDirection: "column",
  },
}));

interface Props extends NavbarProps {
  closeMenu?: () => void;
  showMenu?: boolean;
}

const DesktopMenu = ({ customLink }: Props) => {
  return <Menu customLink={customLink} />;
};

const MobileMenu = ({ closeMenu, customLink, showMenu }: Props) => {
  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <StyledCloseButton onClick={closeMenu}>
        <CloseRoundedIcon style={{ width: 30, height: 30 }} />
      </StyledCloseButton>
      <StyledDrawerContent>
        <Logo />
        <Menu showMenu={showMenu} closeMenu={closeMenu} customLink={customLink} />
      </StyledDrawerContent>
    </Drawer>
  );
};

const StyledGithubIcon = styled("img")({
  height: "100%",
  objectFit: "contain",
  padding: 0,
});

const StyledMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 11,
  height: 35,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    width: "calc(100vw - 60px)",
    maxWidth: 400,
    padding: "40px 30px 40px 30px",
    gap: 20,
    height: "unset",
    "& .connected-section": {
      order: 1,
      width: "100%",
      maxWidth: "unset",
      height: 35,
      marginTop: 40,
      "& p": {
        maxWidth: "unset",
      },
    },
    "& .github-icon": {
      order: 4,
      marginTop: 40,
    },
    "& .custom-link": {
      order: 3,
      width: "100%",
      height: 35,
      "& .base-button": {
        width: "100%",
      },
    },
  },
}));

const Menu = ({ customLink, closeMenu }: Props) => {
  return (
    <StyledMenu className="navbar-menu">
      <SearchInput closeMenu={closeMenu} />
      {customLink && (
        <StyledCustomLink to={customLink.path} className="custom-link">
          <BaseButton transparent>
            <img src={JettonImg} />
            {customLink.text}
          </BaseButton>
        </StyledCustomLink>
      )}
      <ConnecSection />
      <IconButton
        className="github-icon"
        sx={{ padding: 0 }}
        href={JETTON_DEPLOYER_CONTRACTS_GITHUB}
        target="_blank"
      >
        <StyledGithubIcon src={githubIcon} />
      </IconButton>
    </StyledMenu>
  );
};

export { DesktopMenu, MobileMenu };
