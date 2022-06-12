import { atom } from "recoil";
import { JettonDeployState } from "@ton-defi.org/jetton-deployer-contracts";




interface DeployStoreState {
  state: JettonDeployState,
  contractAddress?: null | string,
  jWalletAddress?: null | string,
  jWalletBalance?: null | string,
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