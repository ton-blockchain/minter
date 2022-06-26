import Navbar from "components/navbar";
import { Screen, ScreenContent } from "components/Screen";
import { ROUTES } from "consts";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Connect } from "./Connect";
import { Deployer } from "./Deployer";

function DeployerScreen() {
  const { address } = useConnectionStore();

  return (
    <Screen>
      <Navbar customLink={{ text: "Jetton", path: ROUTES.jetton }} />
      <ScreenContent>{address ? <Deployer /> : <Connect />}</ScreenContent>
    </Screen>
  );
}

export { DeployerScreen };
