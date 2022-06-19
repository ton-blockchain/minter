import BN from "bn.js";
import { Address, Cell, TonClient, Wallet } from "ton";
import { JettonDeployParams, JETTON_DEPLOY_GAS } from "./deploy-controller";
import { initData, JettonMetaDataKeys, JETTON_MINTER_CODE, mintBody } from "./jetton-minter";

export async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function waitForSeqno(wallet: Wallet) {
  const seqnoBefore = await wallet.getSeqNo();

  return async () => {
    for (let attempt = 0; attempt < 10; attempt++) {
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

export function parseGetMethodCall(stack: any[]) {
  return stack.map(([type, val]) => {
    switch (type) {
      case "num":
        return new BN(val.replace("0x", ""), "hex");
      case "cell":
        return Cell.fromBoc(Buffer.from(val.bytes, "base64"))[0];
      default:
        throw new Error("unknown type");
    }
  });
}



export const createDeployParams = (params: JettonDeployParams ) => {
  const metadata: { [s in JettonMetaDataKeys]?: string } = {
    name: params.jettonName,
    symbol: params.jettonSymbol,
    description: params.jettonDescription,
    image: params.imageUri,
  };

  return  {
    code: JETTON_MINTER_CODE,
    data: initData(params.owner, metadata),
    deployer: params.owner,
    value: JETTON_DEPLOY_GAS,
    message: mintBody(params.owner, params.amountToMint),
  };
}