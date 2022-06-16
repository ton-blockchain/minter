import useIsConnected from "hooks/useIsConnected";
import { Deployer } from "screens/deployer";
import Connect from "components/connect";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import Navbar from "components/Navbar";
import React from "react";

const StyledApp = styled(Box)({
  maxWidth: "960px",
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingTop: "140px",
  paddingBottom: "100px",
});

export const EnvContext = React.createContext({
  isSandbox: false,
});

function App() {
  useIsConnected();

  return (
    <StyledApp>
      <EnvContext.Provider
        value={{
          isSandbox: window.location.search.includes("sandbox"),
        }}
      >
        <Navbar />
        <Deployer />
        <Connect />
      </EnvContext.Provider>
    </StyledApp>
  );
}

export default App;
