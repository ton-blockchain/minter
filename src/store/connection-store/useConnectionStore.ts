import { useRecoilState, useResetRecoilState } from "recoil";
import { connectionStateAtom } from ".";
import { Providers } from "lib/env-profiles";
import WalletConnection from "services/wallet-connection";
import { LOCAL_STORAGE_PROVIDER, ROUTES } from "consts";
import { isMobile } from "react-device-detect";
import { useContext } from "react";
import { EnvContext } from "../../App";
import { useNavigate } from "react-router-dom";

function useConnectionStore() {
  const [connectionState, setConnectionState] =
    useRecoilState(connectionStateAtom);
  const resetState = useResetRecoilState(connectionStateAtom);
  const { isSandbox } = useContext(EnvContext);
  const navigate = useNavigate()

  const onTxUrlReady = (value: string) => {
    // @ts-ignore
    window.location = value;
  };

  const connect = async (
    provider: Providers,
    onSessionLink?: (value: string) => void
  ) => {
    const wallet = await WalletConnection.connect(
      provider,
      onSessionLink ? onSessionLink : () => {},
      isSandbox,
      isMobile ? onTxUrlReady : undefined
    );
    localStorage.setItem(LOCAL_STORAGE_PROVIDER, provider);
    setConnectionState((prevState) => ({
      ...prevState,
      address: wallet.address,
      wallet,
    }));
  };

  const disconnect = () => {
    resetState();
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER);
    navigate(ROUTES.connect)
  };

  return {
    ...connectionState,
    disconnect,
    connect,
    resetState,
  };
}

export default useConnectionStore;
