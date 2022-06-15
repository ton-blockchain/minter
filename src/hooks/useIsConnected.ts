import { LOCAL_STORAGE_PROVIDER } from "consts";
import { Providers } from "lib/env-profiles";
import { useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";

function useIsConnected() {
  const { connect } = useConnectionStore();

  useEffect(() => {
    const provider = localStorage.getItem(LOCAL_STORAGE_PROVIDER);
    if (provider) {
      connect(provider as Providers);
    }
  }, []);
}

export default useIsConnected;
