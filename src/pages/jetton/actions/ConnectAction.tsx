import { AppButton } from "components/appButton";
import { onConnect } from "utils";

function ConnectAction() {
  return <AppButton onClick={onConnect}>Connect wallet</AppButton>;
}

export default ConnectAction;
