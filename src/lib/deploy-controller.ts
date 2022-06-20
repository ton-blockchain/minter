import BN from "bn.js";
import { Address, beginCell, Cell, toNano } from "ton";
import { ContractDeployer } from "./contract-deployer";

// TODO temporary
import axios from "axios";
import axiosThrottle from "axios-request-throttle";
import {
  createDeployParams,
  parseGetMethodCall,
  waitForContractDeploy,
} from "./utils";
import { TonConnection } from "@ton-defi.org/ton-connection";
import {
  initData,
  mintBody,
  JETTON_MINTER_CODE,
  parseOnChainData,
  JettonMetaDataKeys,
  changeAdminBody,
} from "./jetton-minter";
axiosThrottle.use(axios, { requestsPerSecond: 0.9 }); // required since toncenter jsonRPC limits to 1 req/sec without API key

export const JETTON_DEPLOY_GAS = toNano(0.25);

export enum JettonDeployState {
  NOT_STARTED,
  BALANCE_CHECK,
  UPLOAD_IMAGE,
  UPLOAD_METADATA,
  AWAITING_MINTER_DEPLOY,
  AWAITING_JWALLET_DEPLOY,
  VERIFY_MINT,
  ALREADY_DEPLOYED,
  DONE,
}

export interface JettonDeployParams {
  jettonName: string;
  jettonSymbol: string;
  jettonDescription?: string;
  owner: Address;
  imageUri?: string;
  amountToMint: BN;
}

class JettonDeployController {
  async createJetton(
    params: JettonDeployParams,
    tonConnection: TonConnection
  ): Promise<Address> {
    const contractDeployer = new ContractDeployer();

    // params.onProgress?.(JettonDeployState.BALANCE_CHECK);
    const balance = await tonConnection._tonClient.getBalance(params.owner);
    if (balance.lt(JETTON_DEPLOY_GAS))
      throw new Error("Not enough balance in deployer wallet");
    const deployParams = createDeployParams(params);
    const contractAddr = contractDeployer.addressForContract(deployParams);

    if (await tonConnection._tonClient.isContractDeployed(contractAddr)) {
      // params.onProgress?.(JettonDeployState.ALREADY_DEPLOYED);
    } else {
      await contractDeployer.deployContract(deployParams, tonConnection);
      // params.onProgress?.(JettonDeployState.AWAITING_MINTER_DEPLOY);
      await waitForContractDeploy(contractAddr, tonConnection._tonClient);
    }

    const jettonDataRes = await tonConnection._tonClient.callGetMethod(
      contractAddr,
      "get_jetton_data"
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const deployedOwnerAddress = (
      parseGetMethodCall(jettonDataRes.stack)[2] as Cell
    )
      .beginParse()
      .readAddress()!;
    if (deployedOwnerAddress.toFriendly() !== params.owner.toFriendly())
      throw new Error("Contract deployed incorrectly");

    // todo why idx:false?
    const jwalletAddressRes = await tonConnection._tonClient.callGetMethod(
      contractAddr,
      "get_wallet_address",
      [
        [
          "tvm.Slice",
          beginCell()
            .storeAddress(params.owner)
            .endCell()
            .toBoc({ idx: false })
            .toString("base64"),
        ],
      ]
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ownerJWalletAddr = (
      parseGetMethodCall(jwalletAddressRes.stack)[0] as Cell
    )
      .beginParse()
      .readAddress()!;

    // params.onProgress?.(JettonDeployState.AWAITING_JWALLET_DEPLOY);
    await waitForContractDeploy(ownerJWalletAddr, tonConnection._tonClient);

    // params.onProgress?.(
    //   JettonDeployState.VERIFY_MINT,
    //   undefined,
    //   contractAddr.toFriendly()
    // ); // TODO better way of emitting the contract?

    const jwalletDataRes = await tonConnection._tonClient.callGetMethod(
      ownerJWalletAddr,
      "get_wallet_data"
    );
    if (
      !(parseGetMethodCall(jwalletDataRes.stack)[0] as BN).eq(
        params.amountToMint
      )
    )
      throw new Error("Mint fail");
    // params.onProgress?.(JettonDeployState.DONE);
    return contractAddr;
  }

  async burnAdmin(contractAddress: Address, tonConnection: TonConnection) {
    // @ts-ignore
    await tonConnection.requestTransaction({
      to: contractAddress,
      value: toNano(0.01), // TODO assuming this is wrong
      message: changeAdminBody(Address.parse("0:0")),
    });
  }

  async getJettonDetails(
    contractAddr: Address,
    owner: Address,
    tonConnection: TonConnection
  ) {
    const jettonDataRes = await tonConnection._tonClient.callGetMethod(
      contractAddr,
      "get_jetton_data"
    );

    const contentCell = parseGetMethodCall(jettonDataRes.stack)[3] as Cell;
    const dict = parseOnChainData(contentCell);

    const jwalletAdressRes = await tonConnection._tonClient.callGetMethod(
      contractAddr,
      "get_wallet_address",
      [
        [
          "tvm.Slice",
          beginCell()
            .storeAddress(owner)
            .endCell()
            .toBoc({ idx: false })
            .toString("base64"),
        ],
      ]
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ownerJWalletAddr = (
      parseGetMethodCall(jwalletAdressRes.stack)[0] as Cell
    )
      .beginParse()
      .readAddress()!;

    const jwalletDataRes = await tonConnection._tonClient.callGetMethod(
      ownerJWalletAddr,
      "get_wallet_data"
    );

    return {
      jetton: {
        ...dict,
        contractAddress: contractAddr.toFriendly(),
        admin: (parseGetMethodCall(jettonDataRes.stack)[2] as Cell).beginParse().readAddress()?.toFriendly(),
      },
      wallet: {
        jettonAmount: (
          parseGetMethodCall(jwalletDataRes.stack)[0] as BN
        ).toString(),
        ownerJWallet: ownerJWalletAddr.toFriendly(),
        owner: owner.toFriendly(),
      },
    };
  }
}

const jettonDeployController = new JettonDeployController();
export { jettonDeployController };
