import { ROUTES } from "consts";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { restoreSession } from "tonstarter-contracts";

function useIsConnected() {
  const navigate = useNavigate();
  const { onConnectionRestored } = useConnectionStore();

  useEffect(() => {
    const restore = async () => {
      try {
        const result = await restoreSession();

        if (result) {
          onConnectionRestored(result.wallet, result.adapterId, result.session);
        }
        if (!result) {
          navigate(ROUTES.connect);
        } else if (window.location.pathname === ROUTES.connect) {
          navigate(ROUTES.deployer);
        }
      } catch (error) {
        navigate(ROUTES.connect);
      }
    };
    restore();
  }, []);
}

export default useIsConnected;
