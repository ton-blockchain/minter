import { styled } from "@mui/material";
import { Box } from "@mui/system";
import Navbar from "components/navbar";
import { createContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { APP_GRID, LOCAL_STORAGE_PROVIDER, ROUTES } from "consts";
import { Providers } from "lib/env-profiles";
import { Route, Routes } from "react-router-dom";
import {  DeployerScreen, JettonScreen } from "pages";
import ConnectPopup from 'components/connect-popup'

const StyledApp = styled(Box)(({theme}) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingBottom: "100px",
  '*::-webkit-scrollbar': {
    display:'none'
  },
  '*::-webkit-scrollbar-track': {
    display:'none'
  },
  '*::-webkit-scrollbar-thumb': {
    display:'none'
  },
  [theme.breakpoints.down('sm')]: {
    width: "calc(100% - 30px)",
  }
}));

export const EnvContext = createContext({
  isSandbox: false,
  isTestnet: false,
});

function App() {
  const { connectOnLoad } = useConnectionStore();

  useEffect(() => {
    connectOnLoad()
  }, []);

  return (
    <StyledApp>
      <EnvContext.Provider
        value={{
          isSandbox: window.location.search.includes("sandbox"),
          isTestnet: window.location.search.includes("testnet"),
        }}
      >
        <Routes>
          <Route path={ROUTES.deployer} element={<DeployerScreen />} />
          <Route path={ROUTES.jettonId} element={<JettonScreen />} />
          <Route path={ROUTES.jetton} element={<JettonScreen />} />
        </Routes>
      </EnvContext.Provider>
      <ConnectPopup />
    </StyledApp>
  );
}

export default App;
