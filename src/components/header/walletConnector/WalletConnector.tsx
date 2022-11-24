import { ClickAwayListener, Typography } from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ArrowDropUp } from "@mui/icons-material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { makeElipsisAddress } from "helpers";
import {
  DisconnectButton,
  WalletButtonContent,
  WalletWrapper,
} from "components/header/walletConnector/styled";
import { AppButton } from "components/appButton";

const WalletConnector = () => {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { disconnect, address, toggleConnect } = useConnectionStore();

  const onDisconnect = () => {
    setShowDisconnect(false);
    disconnect();
  };

  const onClickAway = () => {
    if (showDisconnect) {
      setShowDisconnect(false);
    }
  };

  return (
    <WalletWrapper>
      {address ? (
        <AppButton width={150} height={44} transparent onClick={() => setShowDisconnect(true)}>
          <WalletButtonContent>
            {makeElipsisAddress(address, 4)}
            {showDisconnect ? <ArrowDropUp /> : <ArrowDropDownIcon />}
          </WalletButtonContent>
        </AppButton>
      ) : (
        <AppButton width={150} height={44} onClick={() => toggleConnect(true)}>
          <WalletButtonContent>Connect Wallet</WalletButtonContent>
        </AppButton>
      )}
      {showDisconnect && (
        <ClickAwayListener onClickAway={onClickAway}>
          <DisconnectButton onClick={onDisconnect}>
            <PowerSettingsNewIcon style={{ width: 15, height: 15 }} />
            <Typography>Disconnect</Typography>
          </DisconnectButton>
        </ClickAwayListener>
      )}
    </WalletWrapper>
  );
};

export default WalletConnector;
