import BN from "bn.js";
import { Address, beginCell, Cell, toNano, TonClient } from "ton";
import { ContractDeployer } from "./contract-deployer";

import { createDeployParams } from "./utils";
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
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  dropJettonV2AdminBody,
  isJettonV2Code,
  JETTON_V2_ADMIN_VALUE,
  JETTON_V2_BURN_VALUE,
  JETTON_V2_DEPLOY_VALUE,
  JETTON_V2_MINT_TO_WALLET_VALUE,
  JETTON_V2_MINT_VALUE,
  JETTON_V2_TRANSFER_VALUE,
  mintJettonV2Body,
  updateJettonV2MetadataBody,
} from "./jetton-v2";
import { Network } from "./network";
import {
  buildTransactionMessage,
  buildTransactionRequest,
  sendTransactionAndTrack,
  TransactionOutcome,
} from "./transaction";
import { assertPositiveAmount } from "./amount";

export const JETTON_DEPLOY_GAS = JETTON_V2_DEPLOY_VALUE;
export const JETTON_DEPLOY_MIN_BALANCE = toNano(0.2);

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

export interface JettonCreationResult extends TransactionOutcome {
  address: Address;
}

export class JettonAlreadyDeployedError extends Error {
  constructor(public readonly address: Address) {
    super("A jetton with the same owner and metadata is already deployed");
    this.name = "JettonAlreadyDeployedError";
  }
}

async function isJettonV2(contractAddress: Address, client: TonClient): Promise<boolean> {
  const state = await client.getContractState(contractAddress);

  // Only the exact v2.1 code switches ABI. Every other contract keeps the
  // legacy behavior that the app used before this upgrade.
  return isJettonV2Code(state.code);
}

class JettonDeployController {
  async createJetton(
    params: JettonDeployParams,
    tonConnection: TonConnectUI,
    network: Network,
  ): Promise<JettonCreationResult> {
    assertPositiveAmount(params.amountToMint, "Initial mint");
    const contractDeployer = new ContractDeployer();
    const tc = await getClient(network);

    const deployParams = createDeployParams(params, params.offchainUri);
    const contractAddr = contractDeployer.addressForContract(deployParams);

    const masterWasDeployed = await tc.isContractDeployed(contractAddr);
    if (masterWasDeployed) {
      throw new JettonAlreadyDeployedError(contractAddr);
    }

    // params.onProgress?.(JettonDeployState.BALANCE_CHECK);
    const balance = await tc.getBalance(params.owner);
    if (balance.lt(JETTON_DEPLOY_MIN_BALANCE)) {
      throw new Error("Not enough balance in deployer wallet");
    }
    const { outcome } = await contractDeployer.deployContract(deployParams, tonConnection, network);
    if (!outcome) throw new Error("Deployment transaction was not submitted");
    return { address: contractAddr, ...outcome };
  }

  async burnAdmin(
    contractAddress: Address,
    tonConnection: TonConnectUI,
    walletAddress: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    const tc = await getClient(network);
    const useV2 = await isJettonV2(contractAddress, tc);
    const tx = buildTransactionRequest(network, walletAddress, [
      buildTransactionMessage(
        contractAddress,
        network,
        (useV2 ? JETTON_V2_ADMIN_VALUE : toNano(0.01)).toString(),
        {
          payload: (useV2 ? dropJettonV2AdminBody(0) : changeAdminBody(zeroAddress()))
            .toBoc()
            .toString("base64"),
        },
      ),
    ]);

    return sendTransactionAndTrack(tonConnection, network, tx, contractAddress);
  }

  async mint(
    tonConnection: TonConnectUI,
    jettonMaster: Address,
    amount: BN,
    walletAddress: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    assertPositiveAmount(amount, "Mint");
    const tc = await getClient(network);
    const useV2 = await isJettonV2(jettonMaster, tc);
    const tx = buildTransactionRequest(network, walletAddress, [
      buildTransactionMessage(
        jettonMaster,
        network,
        (useV2 ? JETTON_V2_MINT_VALUE : toNano(0.04)).toString(),
        {
          payload: (useV2
            ? mintJettonV2Body(
                Address.parse(walletAddress),
                Address.parse(walletAddress),
                amount,
                JETTON_V2_MINT_TO_WALLET_VALUE,
                0,
              )
            : mintBody(Address.parse(walletAddress), amount, toNano(0.02), 0)
          )
            .toBoc()
            .toString("base64"),
        },
      ),
    ]);

    return sendTransactionAndTrack(tonConnection, network, tx, jettonMaster);
  }

  async transfer(
    tonConnection: TonConnectUI,
    jettonMaster: Address,
    amount: BN,
    toAddress: string,
    fromAddress: string,
    ownerJettonWallet: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    assertPositiveAmount(amount, "Transfer");
    const tc = await getClient(network);
    const useV2 = await isJettonV2(jettonMaster, tc);

    const tx = buildTransactionRequest(network, fromAddress, [
      buildTransactionMessage(
        ownerJettonWallet,
        network,
        (useV2 ? JETTON_V2_TRANSFER_VALUE : toNano(0.05)).toString(),
        {
          payload: transfer(Address.parse(toAddress), Address.parse(fromAddress), amount)
            .toBoc()
            .toString("base64"),
        },
      ),
    ]);

    return sendTransactionAndTrack(tonConnection, network, tx, ownerJettonWallet);
  }

  async burnJettons(
    tonConnection: TonConnectUI,
    jettonMaster: Address,
    amount: BN,
    jettonAddress: string,
    walletAddress: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    assertPositiveAmount(amount, "Burn");
    const tc = await getClient(network);
    const useV2 = await isJettonV2(jettonMaster, tc);

    const tx = buildTransactionRequest(network, walletAddress, [
      buildTransactionMessage(
        jettonAddress,
        network,
        (useV2 ? JETTON_V2_BURN_VALUE : toNano(0.031)).toString(),
        {
          payload: burn(amount, Address.parse(walletAddress)).toBoc().toString("base64"),
        },
      ),
    ]);

    return sendTransactionAndTrack(tonConnection, network, tx, jettonAddress);
  }

  async getJettonDetails(contractAddr: Address, owner: Address, network: Network) {
    const tc = await getClient(network);
    const minterState = await makeGetCall(
      contractAddr,
      "get_jetton_data",
      [],
      ([totalSupply, __, adminCell, contentCell]) => ({
        admin: adminCell ? cellToAddress(adminCell) : null,
        totalSupply: totalSupply as BN,
        contentCell: contentCell as unknown as Cell,
      }),
      tc,
    );
    const minter = {
      ...minterState,
      ...(await readJettonMetadata(minterState.contentCell)),
    };

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
        ([amount, ownerAddressCell, jettonMasterAddressCell]) => ({
          balance: amount as unknown as BN,
          jWalletAddress,
          ownerAddress: cellToAddress(ownerAddressCell),
          jettonMasterAddress: cellToAddress(jettonMasterAddressCell),
        }),
        tc,
      );
      if (!jettonWallet.jettonMasterAddress.equals(contractAddr)) {
        throw new Error("Jetton wallet reports a different master contract");
      }
      if (!jettonWallet.ownerAddress.equals(owner)) {
        throw new Error("Jetton wallet reports a different owner");
      }
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
    connection: TonConnectUI,
    walletAddress: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    const tc = await getClient(network);
    const useV2 = await isJettonV2(contractAddress, tc);
    const metadata = buildJettonOnchainMetadata(data);
    const body = useV2 ? updateJettonV2MetadataBody(metadata, 0) : updateMetadataBody(metadata);
    const tx = buildTransactionRequest(network, walletAddress, [
      buildTransactionMessage(
        contractAddress,
        network,
        (useV2 ? JETTON_V2_ADMIN_VALUE : toNano(0.01)).toString(),
        { payload: body.toBoc().toString("base64") },
      ),
    ]);

    return sendTransactionAndTrack(connection, network, tx, contractAddress);
  }

  async updateMetadata(
    contractAddress: Address,
    data: {
      [s in JettonMetaDataKeys]?: string | undefined;
    },
    connection: TonConnectUI,
    walletAddress: string,
    network: Network,
  ): Promise<TransactionOutcome> {
    const tc = await getClient(network);
    const useV2 = await isJettonV2(contractAddress, tc);

    const metadata = buildJettonOnchainMetadata(data);
    const body = useV2 ? updateJettonV2MetadataBody(metadata, 0) : updateMetadataBody(metadata);
    const tx = buildTransactionRequest(network, walletAddress, [
      buildTransactionMessage(
        contractAddress,
        network,
        (useV2 ? JETTON_V2_ADMIN_VALUE : toNano(0.01)).toString(),
        { payload: body.toBoc().toString("base64") },
      ),
    ]);

    return sendTransactionAndTrack(connection, network, tx, contractAddress);
  }
}

const jettonDeployController = new JettonDeployController();
export { jettonDeployController };
