import { atom } from "recoil";
import { JettonDeployState } from "lib/deploy-controller";




interface DeployStoreState {
 
}



const deployStateAtom = atom<DeployStoreState>({
  key: "deployState2",
  default: {
    state: JettonDeployState.NOT_STARTED,
    contractAddress: null,
    jWalletAddress: null,
    jWalletBalance: null,
  },
});

export {deployStateAtom}