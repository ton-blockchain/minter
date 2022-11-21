import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect } from "react";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { APP_GRID, ROUTES } from "consts";
import { Route, Routes } from "react-router-dom";
import { DeployerPage, JettonPage } from "pages";
import ConnectPopup from "components/connect-popup";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";

analytics.init();

const AppWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflowY: "scroll",
}));

const FooterBox = styled(Box)(() => ({
  display: "flex",
  flex: 1,
  alignItems: "flex-end",
  justifyContent: "center",
}));

const ScreensWrapper = styled(Box)(({ theme }) => ({
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

const App = () => {
  const { connectOnLoad } = useConnectionStore();

  useEffect(() => {
    connectOnLoad();
  }, []);

  return (
    <AppWrapper>
      <Header />
      <EnvContext.Provider
        value={{
          isSandbox: window.location.search.includes("sandbox"),
          isTestnet: window.location.search.includes("testnet"),
        }}>
        <ScreensWrapper>
          <Routes>
            <Route path={ROUTES.deployer} element={<DeployerPage />} />
            <Route path={ROUTES.jettonId} element={<JettonPage />} />
            <Route path={ROUTES.jetton} element={<JettonPage />} />
          </Routes>
        </ScreensWrapper>
      </EnvContext.Provider>
      <ConnectPopup />
      <FooterBox mt={5} mb={2}>
        <Footer />
      </FooterBox>
    </AppWrapper>
  );
};

export default App;
