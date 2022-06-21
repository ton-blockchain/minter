import { styled } from "@mui/material";
import { Box } from "@mui/system";
import Navbar from "components/Navbar";
import { createContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { APP_GRID, LOCAL_STORAGE_PROVIDER, ROUTES } from "consts";
import { Providers } from "lib/env-profiles";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { ConnectScreen, DeployerScreen, JettonScreen } from "screens";

const StyledApp = styled(Box)({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingBottom: "100px",
});

export const EnvContext = createContext({
  isSandbox: false,
  isTestnet: false,
});

function App() {
  const { connect } = useConnectionStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const provider = localStorage.getItem(LOCAL_STORAGE_PROVIDER);
      
      if (!provider) {
        navigate(ROUTES.connect);
        return;
      }
   ;
      try {
       
        await connect(provider as Providers);
       
       
      } catch (error) {
        
        navigate(ROUTES.connect);
      }
    })();
  }, []);

  return (
    <StyledApp>
      <EnvContext.Provider
        value={{
          isSandbox: window.location.search.includes("sandbox"),
          isTestnet: window.location.search.includes("testnet"),
        }}
      >
        <Navbar />
        <Routes>
          <Route path={ROUTES.deployer} element={<DeployerScreen />} />
          <Route path={ROUTES.connect} element={<ConnectScreen />} />
          <Route path={ROUTES.jettonId} element={<JettonScreen />} />
          <Route path={ROUTES.jetton} element={<JettonScreen />} />
        </Routes>
      </EnvContext.Provider>
    </StyledApp>
  );
}

export default App;
