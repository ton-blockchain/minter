import { Box, Drawer, IconButton, styled } from "@mui/material";
import SearchInput from "components/SearchInput";
import { JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import { Link } from "react-router-dom";
import ConnecSection from "./ConnecSection";
import { NavbarProps } from "./types";
import githubIcon from "assets/github.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BaseButton from "components/BaseButton";

const StyledCustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "& button": {
    borderRadius: 40,
    fontWeight: 400,
    fontSize: 12,
  },
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
  return <Menu customLink={customLink} />;
};

const MobileMenu = ({ closeMenu, customLink, showMenu }: Props) => {
  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <StyledCloseButton onClick={closeMenu}>
        <CloseRoundedIcon style={{ width: 30, height: 30 }} />
      </StyledCloseButton>
      <Menu showMenu={showMenu} closeMenu={closeMenu} customLink={customLink} />
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
    maxWidth: 500,
    paddingTop: 70,
    gap: 20,
    height: "unset",
    "& .search": {
      order: 2,
    },
    "& .connected-section": {
      order: 1,
    },
    "& .github-icon": {
      order: 4,
    },
    "& .custom-link": {
      order: 3,
    },
  },
}));

const Menu = ({ customLink }: Props) => {
  return (
    <StyledMenu className="navbar-menu">
      <SearchInput />
      {customLink && (
        <StyledCustomLink to={customLink.path} className="custom-link">
          <BaseButton>{customLink.text}</BaseButton>
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
