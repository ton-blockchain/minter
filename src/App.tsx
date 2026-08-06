import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect } from "react";
import { APP_GRID, ROUTES } from "consts";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { DeployerPage, Jetton } from "pages";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { useJettonLogo } from "hooks/useJettonLogo";
import useNotification from "hooks/useNotification";
import { useNetwork } from "lib/hooks/useNetwork";

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

const ScreensWrapper = styled(Box)({
  "*::-webkit-scrollbar": {
    display: "none",
  },
  "*::-webkit-scrollbar-track": {
    display: "none",
  },
  "*::-webkit-scrollbar-thumb": {
    display: "none",
  },
});

const FlexibleBox = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

export const EnvContext = createContext({
  isSandbox: false,
  isTestnet: false,
});

const PageNotFound = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    showNotification("Page not found", "error");
  }, [showNotification]);

  return <Box />;
};

interface ContentWrapperProps {
  children?: any;
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <FlexibleBox>
      {children}
      <Outlet />
    </FlexibleBox>
  );
};

const App = () => {
  const { resetJetton } = useJettonLogo();
  const location = useLocation();
  const { network } = useNetwork();

  useEffect(() => {
    resetJetton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isSandbox = window.location.search.includes("sandbox");
  const isTestnet = network === "testnet";

  return (
    <AppWrapper>
      <EnvContext.Provider
        value={{
          isSandbox: isSandbox,
          isTestnet: isTestnet,
        }}>
        <ScreensWrapper>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Navigate to={{ pathname: "/", search: location.search }} />
                  <PageNotFound />
                </>
              }
            />
            <Route path="/" element={<Header />}>
              <Route path="/" element={<ContentWrapper />}>
                <Route path={ROUTES.deployer} element={<DeployerPage />} />
                <Route path={ROUTES.jettonId} element={<Jetton />} />
              </Route>
            </Route>
          </Routes>
        </ScreensWrapper>
      </EnvContext.Provider>
      <FooterBox mt={5}>
        <Footer />
      </FooterBox>
    </AppWrapper>
  );
};

export default App;
