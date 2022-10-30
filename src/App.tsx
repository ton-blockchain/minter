import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { APP_GRID, ROUTES } from "consts";
import { Route, Routes } from "react-router-dom";
import { DeployerPage, JettonPage } from "pages";
import ConnectPopup from "components/connect-popup";
import analytics from "services/analytics";
import Navbar from "components/navbar";
import Footer from "components/footer/Footer";

const renderNavigation = (route: string) => {
  if (route === ROUTES.jettonId) {
    return <Navbar customLink={{ text: "Create Jetton", path: ROUTES.deployer }} />;
  } else if (route === ROUTES.jetton) {
    return <Navbar customLink={{ text: "Create Jetton", path: ROUTES.deployer }} />;
  } else {
    return <Navbar />;
  }
};

analytics.init();
const StyledApp = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  height: "100%",
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
  const pathname = window.location.pathname;

  const defineNavigationRoute =
    pathname?.length === 1
      ? ROUTES.deployer
      : pathname.includes(ROUTES.jetton)
      ? ROUTES.jetton
      : ROUTES.jettonId;

  useEffect(() => {
    connectOnLoad();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}>
      {renderNavigation(defineNavigationRoute)}
      <EnvContext.Provider
        value={{
          isSandbox: window.location.search.includes("sandbox"),
          isTestnet: window.location.search.includes("testnet"),
        }}>
        <StyledApp>
          <Routes>
            <Route path={ROUTES.deployer} element={<DeployerPage />} />
            <Route path={ROUTES.jettonId} element={<JettonPage />} />
            <Route path={ROUTES.jetton} element={<JettonPage />} />
          </Routes>
        </StyledApp>
      </EnvContext.Provider>
      <ConnectPopup />
      <Box mt={25}>
        <Footer />
      </Box>
    </Box>
  );
}

export default App;
