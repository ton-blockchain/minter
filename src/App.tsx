import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect, useState } from "react";
import { APP_GRID, ROUTES } from "consts";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { DeployerPage, Jetton } from "pages";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { SearchSection } from "components/SearchSection";
import { useJettonLogo } from "hooks/useJettonLogo";
import useNotification from "hooks/useNotification";
import { HeroGlow, FooterGlow } from "components/GlowEffect";

analytics.init();

const AppWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  position: "relative",
  isolation: "isolate",
  overflowX: "hidden",
  background: "#10161F",
}));

const FooterBox = styled(Box)(() => ({
  display: "flex",
  flex: 1,
  alignItems: "flex-end",
  justifyContent: "center",
  position: "relative",
  zIndex: 1,
}));

const ScreensWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  paddingTop: 80,
  [theme.breakpoints.down("sm")]: {
    paddingTop: 20, // ← меньше на мобилке
  },
}));

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
  }, []);
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
  const [example, setExample] = useState<string | undefined>(undefined);

  useEffect(() => {
    resetJetton();
  }, [location.pathname]);

  const isSandbox = window.location.search.includes("sandbox");
  const isTestnet = window.location.search.includes("testnet");

  return (
    <AppWrapper>
      <HeroGlow />
      <EnvContext.Provider value={{ isSandbox, isTestnet }}>
        <ScreensWrapper>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Navigate to="/" />
                  <PageNotFound />
                </>
              }
            />
            <Route path="/" element={<Header />}>
              <Route
                path="/"
                element={
                  <>
                    <ContentWrapper />
                  </>
                }>
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
      <FooterGlow />
    </AppWrapper>
  );
};

export default App;
