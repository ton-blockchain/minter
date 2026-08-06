import { Address, beginCell } from "ton";
import { JettonDeployParams, JETTON_DEPLOY_GAS } from "./deploy-controller";
import {
  initJettonV2Data,
  JETTON_V2_MINTER_CODE,
  JETTON_V2_MINT_TO_WALLET_VALUE,
  mintJettonV2Body,
} from "./jetton-v2";

export function zeroAddress(): Address {
  return beginCell()
    .storeUint(2, 2)
    .storeUint(0, 1)
    .storeUint(0, 8)
    .storeUint(0, 256)
    .endCell()
    .beginParse()
    .readAddress() as Address;
}

export const createDeployParams = (params: JettonDeployParams, offchainUri?: string) => {
  const queryId = parseInt(process.env.REACT_APP_DEPLOY_QUERY_ID ?? "0");

  return {
    code: JETTON_V2_MINTER_CODE,
    data: initJettonV2Data(params.owner, params.onchainMetaData, offchainUri),
    deployer: params.owner,
    value: JETTON_DEPLOY_GAS,
    message: mintJettonV2Body(
      params.owner,
      params.owner,
      params.amountToMint,
      JETTON_V2_MINT_TO_WALLET_VALUE,
      queryId,
    ),
  };
};
