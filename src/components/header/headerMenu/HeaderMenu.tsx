import { Drawer, IconButton } from "@mui/material";
import { JETTON_DEPLOYER_CONTRACTS_GITHUB } from "consts";
import WalletConnector from "components/header/walletConnector/WalletConnector";
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

const HeaderMenu: React.FC<MenuProps> = () => {
  return (
    <AppMenu>
      <WalletConnector />
      <IconButton sx={{ padding: 0 }} href={JETTON_DEPLOYER_CONTRACTS_GITHUB} target="_blank">
        <StyledGithubIcon src={githubIcon} />
        <HeaderTypography variant="h5">GitHub</HeaderTypography>
      </IconButton>
    </AppMenu>
  );
};

export { HeaderMenu, MobileMenu };
