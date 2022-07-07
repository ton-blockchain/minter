import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { APP_GRID, ROUTES } from "consts";
import { Route, Routes } from "react-router-dom";
import { DeployerPage, JettonPage } from "pages";
import ConnectPopup from "components/connect-popup";
import 'services/analytics'

console.log(process.env.REACT_APP_GA);

const StyledApp = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",
  "*::-webkit-scrollbar": {
    display: "none",
  },
  "*::-webkit-scrollbar-track": {
    display: "none",
  },
  "*::-webkit-scrollbar-thumb": {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

export const EnvContext = createContext({
  isSandbox: false,
  isTestnet: false,
});


function App() {
  const { connectOnLoad } = useConnectionStore();

  useEffect(() => {
    connectOnLoad();
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
          <Route path={ROUTES.deployer} element={<DeployerPage />} />
          <Route path={ROUTES.jettonId} element={<JettonPage />} />
          <Route path={ROUTES.jetton} element={<JettonPage />} />
        </Routes>
      </EnvContext.Provider>
      <ConnectPopup />
    </StyledApp>
  );
}

export default App;
