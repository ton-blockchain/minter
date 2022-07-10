import { JettonDeployState } from 'lib/deploy-controller';

export interface DeployProgressState {
  state: JettonDeployState;
  contractAddress?: null | string;
  jWalletAddress?: null | string;
  jWalletBalance?: null | string;
}

export interface FormState {
  name: string;
  decimals: string;
  initialSupply: string;
  totalSupply: string;
  tokenImage: string;
}
