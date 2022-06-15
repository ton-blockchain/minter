import { useRecoilState, useResetRecoilState } from "recoil";
import { connectionStateAtom } from ".";
import { Providers } from "lib/env-profiles";
import WalletConnection from "services/wallet-connection";
import { LOCAL_STORAGE_PROVIDER } from "consts";

function useConnectionStore() {
  const [connectionState, setConnectionState] =
    useRecoilState(connectionStateAtom);
  const resetState = useResetRecoilState(connectionStateAtom);

  const connect = async (
    provider: Providers,
    onSessionLink?: (value: string) => void
  ) => {
    const wallet = await WalletConnection.connect(
      provider,
      onSessionLink ? onSessionLink : () => {},
      false
    );
    localStorage.setItem(LOCAL_STORAGE_PROVIDER, provider);
    setConnectionState((prevState) => ({
      ...prevState,
      address: wallet.address,
      wallet,
    }));
  };


  const disconnect = () => {
    resetState()
    localStorage.removeItem(LOCAL_STORAGE_PROVIDER)
  }

  

  return {
    ...connectionState,
    disconnect,
    connect,
    resetState
  };
}

export default useConnectionStore;
