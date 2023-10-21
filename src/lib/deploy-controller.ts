import BN from "bn.js";
import { Address, beginCell, Cell, toNano } from "ton";
import { ContractDeployer } from "./contract-deployer";

import { createDeployParams, waitForContractDeploy, waitForSeqno } from "./utils";
import { TonConnection } from "@ton-defi.org/ton-connection";
import { zeroAddress } from "./utils";
import {
  buildJettonOnchainMetadata,
  burn,
  mintBody,
  transfer,
  updateMetadataBody,
} from "./jetton-minter";
import { readJettonMetadata, changeAdminBody, JettonMetaDataKeys } from "./jetton-minter";
import { getClient } from "./get-ton-client";
import { cellToAddress, makeGetCall } from "./make-get-call";

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
  onchainMetaData?: {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    decimals?: string;
  };
  offchainUri?: string;
  owner: Address;
  amountToMint: BN;
}

class JettonDeployController {
  async createJetton(params: JettonDeployParams, tonConnection: TonConnection): Promise<Address> {
    const contractDeployer = new ContractDeployer();
    const tc = await getClient();

    // params.onProgress?.(JettonDeployState.BALANCE_CHECK);
    const balance = await tc.getBalance(params.owner);
    if (balance.lt(JETTON_DEPLOY_GAS)) throw new Error("Not enough balance in deployer wallet");
    const deployParams = createDeployParams(params, params.offchainUri);
    const contractAddr = contractDeployer.addressForContract(deployParams);

    if (await tc.isContractDeployed(contractAddr)) {
      // params.onProgress?.(JettonDeployState.ALREADY_DEPLOYED);
    } else {
      await contractDeployer.deployContract(deployParams, tonConnection);
      // params.onProgress?.(JettonDeployState.AWAITING_MINTER_DEPLOY);
      await waitForContractDeploy(contractAddr, tc);
    }

    const ownerJWalletAddr = await makeGetCall(
      contractAddr,
      "get_wallet_address",
      [beginCell().storeAddress(params.owner).endCell()],
      ([addr]) => (addr as Cell).beginParse().readAddress()!,
      tc,
    );

    // params.onProgress?.(JettonDeployState.AWAITING_JWALLET_DEPLOY);
    await waitForContractDeploy(ownerJWalletAddr, tc);

    // params.onProgress?.(
    //   JettonDeployState.VERIFY_MINT,
    //   undefined,
    //   contractAddr.toFriendly()
    // ); // TODO better way of emitting the contract?

    // params.onProgress?.(JettonDeployState.DONE);
    return contractAddr;
  }

  async burnAdmin(contractAddress: Address, tonConnection: TonConnection) {
    // @ts-ignore
    const { address } = await tonConnection.connect();
    const tc = await getClient();
    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );

    await tonConnection.requestTransaction({
      to: contractAddress,
      value: toNano(0.01),
      message: changeAdminBody(zeroAddress()),
    });

    await waiter();
  }

  async mint(tonConnection: TonConnection, jettonMaster: Address, amount: BN) {
    const { address } = await tonConnection.connect();
    const tc = await getClient();
    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );
    await tonConnection.requestTransaction({
      to: jettonMaster,
      value: toNano(0.04),
      message: mintBody(Address.parse(address), amount, toNano(0.02), 0),
    });
    await waiter();
  }

  async transfer(
    tonConnection: TonConnection,
    amount: BN,
    toAddress: string,
    fromAddress: string,
    ownerJettonWallet: string,
  ) {
    const { address } = await tonConnection.connect();
    const tc = await getClient();

    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );

    await tonConnection.requestTransaction({
      to: Address.parse(ownerJettonWallet),
      value: toNano(0.05),
      message: transfer(Address.parse(toAddress), Address.parse(fromAddress), amount),
    });

    await waiter();
  }

  async burnJettons(tonConnection: TonConnection, amount: BN, jettonAddress: string) {
    const { address } = await tonConnection.connect();
    const tc = await getClient();

    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );

    await tonConnection.requestTransaction({
      to: Address.parse(jettonAddress),
      value: toNano(0.031),
      message: burn(amount, Address.parse(address)),
    });

    await waiter();
  }

  async getJettonDetails(contractAddr: Address, owner: Address, tonConnection: TonConnection) {
    const tc = await getClient();
    const minter = await makeGetCall(
      contractAddr,
      "get_jetton_data",
      [],
      async ([totalSupply, __, adminCell, contentCell]) => ({
        ...(await readJettonMetadata(contentCell as unknown as Cell)),
        admin: cellToAddress(adminCell),
        totalSupply: totalSupply as BN,
      }),
      tc,
    );

    const jWalletAddress = await makeGetCall(
      contractAddr,
      "get_wallet_address",
      [beginCell().storeAddress(owner).endCell()],
      ([addressCell]) => cellToAddress(addressCell),
      tc,
    );

    const isDeployed = await tc.isContractDeployed(jWalletAddress);

    let jettonWallet;
    if (isDeployed) {
      jettonWallet = await makeGetCall(
        jWalletAddress,
        "get_wallet_data",
        [],
        ([amount, _, jettonMasterAddressCell]) => ({
          balance: amount as unknown as BN,
          jWalletAddress,
          jettonMasterAddress: cellToAddress(jettonMasterAddressCell),
        }),
        tc,
      );
    } else {
      jettonWallet = null;
    }

    return {
      minter,
      jettonWallet,
    };
  }

  async fixFaultyJetton(
    contractAddress: Address,
    data: {
      [s in JettonMetaDataKeys]?: string | undefined;
    },
    connection: TonConnection,
  ) {
    const { address } = await connection.connect();
    const tc = await getClient();
    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );

    await connection.requestTransaction({
      to: contractAddress,
      message: updateMetadataBody(buildJettonOnchainMetadata(data)),
      value: toNano(0.01),
    });

    await waiter();
  }

  async updateMetadata(
    contractAddress: Address,
    data: {
      [s in JettonMetaDataKeys]?: string | undefined;
    },
    connection: TonConnection,
  ) {
    const { address } = await connection.connect();
    const tc = await getClient();
    const waiter = await waitForSeqno(
      tc.openWalletFromAddress({
        source: Address.parse(address),
      }),
    );

    await connection.requestTransaction({
      to: contractAddress,
      message: updateMetadataBody(buildJettonOnchainMetadata(data)),
      value: toNano(0.01),
    });

    await waiter();
  }
}

const jettonDeployController = new JettonDeployController();
export { jettonDeployController };
