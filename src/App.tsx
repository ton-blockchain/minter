import { Route, Routes } from "react-router-dom";
import { ConnectScreen, DeployerScreen } from "./screens";
import "./App.css";
import { ROUTES } from "consts";
import Navbar from "components/Navbar";
import useIsConnected from "hooks/useIsConnected";
import { DeployerScreen2 } from "screens/deployer/newDeployer";

function App() {
  useIsConnected();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path={ROUTES.deployer} element={<DeployerScreen2 />} />
        <Route path={ROUTES.connect} element={<ConnectScreen />} />
      </Routes>
    </div>
  );
}

export default App;
