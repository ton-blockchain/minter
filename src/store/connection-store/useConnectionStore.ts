import { useRecoilState, useResetRecoilState } from "recoil";
import { connectionStateAtom } from ".";
import { Providers } from "lib/env-profiles";
import WalletConnection from "services/wallet-connection";
import { LOCAL_STORAGE_PROVIDER } from "consts";
import { isMobile } from "react-device-detect";
import { useContext } from "react";
import { EnvContext } from "../../App";

function useConnectionStore() {
  const [connectionState, setConnectionState] = useRecoilState(connectionStateAtom);
  const resetState = useResetRecoilState(connectionStateAtom);
  const { isSandbox } = useContext(EnvContext);

  const onTxUrlReady = (value: string) => {
    // @ts-ignore
    window.location = value;
  };

  const toggleConnect = (value: boolean) => {
    setConnectionState((prevState) => ({
      ...prevState,
      showConnect: value,
    }));
  };

  const connect = async (provider: Providers, onSessionLink?: (value: string) => void) => {
    try {
      setConnectionState((prevState) => ({
        ...prevState,
        isConnecting: true,
      }));

      const wallet = await WalletConnection.connect(
        provider,
        onSessionLink ? onSessionLink : () => {},
        isSandbox,
        isMobile ? onTxUrlReady : undefined,
      );

      localStorage.setItem(LOCAL_STORAGE_PROVIDER, provider);
      setConnectionState((prevState) => ({
        ...prevState,
        address: wallet.address,
        wallet,
        adapterId: provider,
      }));
    } catch (error) {
    } finally {
      setConnectionState((prevState) => ({
        ...prevState,
        isConnecting: false,
      }));
    }
  };

  const connectOnLoad = async () => {
    const provider = localStorage.getItem(LOCAL_STORAGE_PROVIDER);
    if (provider) {
      connect(provider as Providers);
    } else {
      setConnectionState((prevState) => ({
        ...prevState,
        isConnecting: false,
      }));
    }
  };

  const disconnect = () => {
    setConnectionState((prevState) => ({
      ...prevState,
      address: null,
      wallet: null,
      adapterId: null,
    }));
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER);
  };

  return {
    ...connectionState,
    disconnect,
    connect,
    resetState,
    connectOnLoad,
    toggleConnect,
  };
}

export default useConnectionStore;
