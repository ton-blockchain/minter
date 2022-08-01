import BN from "bn.js";
import { Address, beginCell, Cell, toNano, TonClient, Wallet } from "ton";
import { JettonDeployParams, JETTON_DEPLOY_GAS } from "./deploy-controller";
import { initData, JettonMetaDataKeys, JETTON_MINTER_CODE, mintBody } from "./jetton-minter";

export async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

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

export async function waitForSeqno(wallet: Wallet) {
  const seqnoBefore = await wallet.getSeqNo();

  return async () => {
    for (let attempt = 0; attempt < 25; attempt++) {
      await sleep(3000);
      const seqnoAfter = await wallet.getSeqNo();
      if (seqnoAfter > seqnoBefore) return;
    }
    throw new Error("Timeout");
  };
}

export async function waitForContractDeploy(address: Address, client: TonClient) {
  let isDeployed = false;
  let maxTries = 25;
  while (!isDeployed && maxTries > 0) {
    maxTries--;
    isDeployed = await client.isContractDeployed(address);
    if (isDeployed) return;
    await sleep(3000);
  }
  throw new Error("Timeout");
}

export const createDeployParams = (params: JettonDeployParams) => {
  const metadata: { [s in JettonMetaDataKeys]?: string } = {
    name: params.jettonName,
    symbol: params.jettonSymbol,
    description: params.jettonDescription,
    image: params.imageUri,
  };

  const queryId = parseInt(process.env.REACT_APP_DEPLOY_QUERY_ID ?? "0");

  return {
    code: JETTON_MINTER_CODE,
    data: initData(
      params.owner,
      "https://ipfs.io/ipfs/QmZMcqfybxkYKx7zBSDNv3GDnzAPpyTcyofwXsNYaN94Nd",
    ),
    deployer: params.owner,
    value: JETTON_DEPLOY_GAS,
    message: mintBody(params.owner, params.amountToMint, toNano(0.2), queryId),
  };
};
