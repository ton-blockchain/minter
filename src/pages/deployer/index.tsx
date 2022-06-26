import Navbar from "components/navbar";
import { Screen, ScreenContent } from "components/Screen";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Connect } from "./Connect";
import { Deployer } from "./Deployer";

function DeployerScreen() {
  const { address } = useConnectionStore();

  return (
    <Screen>
      <Navbar />
      <ScreenContent>{address ? <Deployer /> : <Connect />}</ScreenContent>
    </Screen>
  );
}

export { DeployerScreen };
