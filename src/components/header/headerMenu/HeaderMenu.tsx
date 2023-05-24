import { Box, Drawer, IconButton, styled } from "@mui/material";
import githubIcon from "assets/icons/github-logo.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppLogo } from "components/appLogo";
import {
  CloseMenuButton,
  DrawerContent,
  StyledGithubIcon,
  AppMenu,
  HeaderTypography,
} from "./styled";
import { TonConnectButton } from "@tonconnect/ui-react";

interface MenuProps {
  closeMenu?: () => void;
  showMenu?: boolean;
}

const MobileMenu: React.FC<MenuProps> = ({ closeMenu, showMenu }) => {
  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <CloseMenuButton onClick={closeMenu}>
        <CloseRoundedIcon style={{ width: 30, height: 30 }} />
      </CloseMenuButton>
      <DrawerContent>
        <AppLogo />
        <HeaderMenu showMenu={showMenu} closeMenu={closeMenu} />
      </DrawerContent>
    </Drawer>
  );
};

const HeaderMenu: React.FC<MenuProps> = (props) => {
  return (
    <AppMenu>
      <div onClick={props.closeMenu}>
        <StyledTonConnectButton />
      </div>
      <IconButton
        sx={{ padding: 0, ml: 1.5 }}
        href="https://github.com/ton-blockchain/minter"
        target="_blank">
        <StyledGithubIcon width={20} height={20} src={githubIcon} />
        <HeaderTypography variant="h5">GitHub</HeaderTypography>
      </IconButton>
    </AppMenu>
  );
};

const StyledTonConnectButton = styled(TonConnectButton)(({ theme }) => ({
  button: {
    background: theme.palette.primary.main,
    "*": { color: "white" },
    svg: {
      "*": {
        stroke: "white",
      },
    },
  },
}));

export { HeaderMenu, MobileMenu };
