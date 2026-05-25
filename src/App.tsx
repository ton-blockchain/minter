import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect, useState } from "react";
import { APP_GRID, ROUTES } from "consts";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { DeployerPage, Jetton } from "pages";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { useJettonLogo } from "hooks/useJettonLogo";
import useNotification from "hooks/useNotification";
import { HeroGlow, FooterGlow } from "components/GlowEffect";
import { GlobalStyles } from "@mui/material";

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

const ScreensWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isTestnet",
})<{ isTestnet?: boolean }>(({ theme, isTestnet }) => ({
  position: "relative",
  zIndex: 1,
  paddingTop: 80,
  [theme.breakpoints.down("sm")]: {
    paddingTop: isTestnet ? 100 : 20,
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

const ContentWrapper = () => {
  return (
    <FlexibleBox>
      <Outlet />
    </FlexibleBox>
  );
};

const App = () => {
  const { resetJetton } = useJettonLogo();
  const location = useLocation();

  useEffect(() => {
    resetJetton();
  }, [location.pathname]);

  const isSandbox = window.location.search.includes("sandbox");
  const isTestnet = window.location.search.includes("testnet");

  return (
    <AppWrapper>
      <GlobalStyles
        styles={`
    [data-tc-dropdown-container] {
      max-width: calc(100vw - 32px) !important;
      left: auto !important;
      right: 16px !important;
    }

    [data-tc-dropdown] {
      background: #1D2633 !important;
      border: 0.5px solid #364459 !important;
      border-radius: 16px !important;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3) !important;
      overflow: hidden !important;
    }

    [data-tc-dropdown] ul {
      background: #1D2633 !important;
    }

    [data-tc-dropdown] li {
      background: #1D2633 !important;
    }

    [data-tc-dropdown] button {
      background: #1D2633 !important;
      transition: background 0.15s ease !important;
    }

    [data-tc-dropdown] button:hover {
      background: #222C3D !important;
    }

    [data-tc-dropdown] [data-tc-text] {
      color: #FFFFFF !important;
    }

    [data-tc-dropdown] svg path {
      fill: #93A5B8 !important;
    }

    tc-wallet-selector,
    [data-tc-wallet-selector] {
      background: #1D2633 !important;
    }

    @media (max-width: 600px) {
      [data-tc-dropdown-container] {
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
      }
    }
  `}
      />
      <HeroGlow />
      <EnvContext.Provider value={{ isSandbox, isTestnet }}>
        <ScreensWrapper isTestnet={isTestnet}>
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
      <FooterGlow />
    </AppWrapper>
  );
};

export default App;
