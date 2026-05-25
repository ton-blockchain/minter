import { styled } from "@mui/material";
import { AppMenu } from "./styled";
import { TonConnectButton } from "@tonconnect/ui-react";

interface MenuProps {
  closeMenu?: () => void;
  showMenu?: boolean;
}

const HeaderMenu: React.FC<MenuProps> = () => {
  return (
    <AppMenu>
      <StyledTonConnectButton />
    </AppMenu>
  );
};

const StyledTonConnectButton = styled(TonConnectButton)(({ theme }) => ({
  button: {
    background: "#1EAEFB",
    borderRadius: 40,
    height: 40,
    padding: "0 18px",
    fontSize: 14,
    fontWeight: 600,
    "*": { color: "white" },
    svg: { "*": { stroke: "white" } },
    "& > div": {
      display: "none",
    },
    "&::before": {
      content: "'Connect'",
    },
    [theme.breakpoints.down("sm")]: {
      height: 36,
      fontSize: 14,
      padding: "0 16px",
    },
  },
}));

export { HeaderMenu };
