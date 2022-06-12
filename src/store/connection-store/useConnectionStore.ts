import { useMemo } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Wallet } from "@ton-defi.org/ton-connection";
import { ConnectionStateAtom, connectionStateAtom } from ".";

const getSessionlink = (session?: any) => {
  if (!session || typeof session === "boolean") {
    return "";
  }

  return session.link
    .replace("ton-test://", "https://test.tonhub.com/")
    .replace("ton://", "https://tonhub.com/");
};

function useConnectionStore() {
  const [connectionState, setConnectionState] =
    useRecoilState(connectionStateAtom);
  const resetState = useResetRecoilState(connectionStateAtom);
  const { session } = connectionState;

  const setPropertyValue = (name: keyof ConnectionStateAtom, value: any) => {
    setConnectionState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onWalletConnect = (_wallet: Wallet) => {
    setConnectionState((prevState) => ({
      ...prevState,
      address: _wallet.address,
      wallet: _wallet,
    }));
  };

  // todo sy
  const onSessionCreated = (_session: any, adapter: string) => {
    setConnectionState((prevState) => ({
      ...prevState,
      session: _session,
      adapterId: adapter,
    }));
  };

  const onConnectionRestored = (
    wallet: Wallet,
    adapterId: string, // todo sy
    session: any
  ) => {
    setConnectionState((prevState) => ({
      ...prevState,
      session,
      adapterId,
      wallet,
      address: wallet.address,
    }));
  };

  const sessionLink = useMemo(() => getSessionlink(session), [session]);

  return {
    ...connectionState,
    setPropertyValue,
    onWalletConnect,
    resetState,
    onSessionCreated,
    sessionLink,
    onConnectionRestored,
  };
}

export default useConnectionStore;
