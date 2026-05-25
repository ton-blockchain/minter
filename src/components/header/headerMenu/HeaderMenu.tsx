import { styled } from "@mui/material";
import { AppMenu } from "./styled";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { AppButton } from "components/appButton";
import { onConnect } from "utils";

interface MenuProps {
  closeMenu?: () => void;
  showMenu?: boolean;
}

const HeaderMenu: React.FC<MenuProps> = () => {
  const address = useTonAddress();

  return (
    <AppMenu>
      {address ? (
        <StyledTonConnectButton />
      ) : (
        <AppButton height={40} width={120} onClick={onConnect}>
          Connect
        </AppButton>
      )}
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
    [theme.breakpoints.down("sm")]: {
      height: 36,
      fontSize: 14,
      padding: "0 16px",
    },
  },
}));

export { HeaderMenu };
