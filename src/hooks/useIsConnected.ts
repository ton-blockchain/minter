import { useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";

function useIsConnected() {
  const { onConnectionRestored } = useConnectionStore();

  useEffect(() => {
    const restore = async () => {
      try {
        // todo sy const result = await restoreSession();

        // if (result) {
        //   onConnectionRestored(result.wallet, result.adapterId, result.session);
        // }
      } catch (error) {
        
        
      }
    };
    restore();
  }, []);
}

export default useIsConnected;
