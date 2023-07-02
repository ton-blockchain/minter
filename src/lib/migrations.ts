import { Cell, beginCell, Address, TonClient } from "ton";

import masterHex from "./contracts/MigrationMaster.compiled.json";
import helperHex from "./contracts/MigrationHelper.compiled.json";
import { useTonAddress, useTonConnectUI, TonConnectUI } from "@tonconnect/ui-react";
import { getClient } from "./get-ton-client";
import BN from "bn.js";
import { ContractDeployer } from "./contract-deployer";
import WalletConnection from "services/wallet-connection";
import { waitForContractDeploy } from "./utils";

export const MIGRATION_MASTER_CODE = Cell.fromBoc(masterHex.hex)[0];
export const MIGRATION_HELPER_CODE = Cell.fromBoc(helperHex.hex)[0]; // code cell from build output

enum OPS {
  Migrate = 0x79e4748e,
}

export const MIGRATION_MASTER_DEPLOY_GAS = new BN("100000000");
export const MIGRATION_HELPER_DEPLOY_GAS = new BN("20000000");

export type MigrationMasterConfig = {
  oldJettonMinter: Address;
  newJettonMinter: Address;
  oldWalletCode?: Cell;
  newWalletCode?: Cell;
};

export async function migrationMasterConfigToCell(config: MigrationMasterConfig): Promise<Cell> {
  const client = await getClient();
  const oldWalletCode = Cell.fromBoc(
    Buffer.from(
      (await client.callGetMethod(config.oldJettonMinter, "get_jetton_data")).stack[4][1].bytes,
      "base64",
    ).toString("hex"),
  )[0];
  const newWalletCode = Cell.fromBoc(
    Buffer.from(
      (await client.callGetMethod(config.newJettonMinter, "get_jetton_data")).stack[4][1].bytes,
      "base64",
    ).toString("hex"),
  )[0];

  return beginCell()
    .storeAddress(config.oldJettonMinter)
    .storeAddress(config.newJettonMinter)
    .storeRef(config.oldWalletCode || oldWalletCode)
    .storeRef(config.newWalletCode || newWalletCode)
    .endCell();
}

export type MigrationHelperConfig = {
  oldJettonMinter: Address;
  migrationMaster: Address;
  recipient: Address;
  oldWalletCode?: Cell;
};

export async function migrationHelperConfigToCell(config: MigrationHelperConfig): Promise<Cell> {
  const client = await getClient();
  const oldWalletCode = Cell.fromBoc(
    Buffer.from(
      (await client.callGetMethod(config.oldJettonMinter, "get_jetton_data")).stack[4][1].bytes,
      "base64",
    ).toString("hex"),
  )[0];
  return beginCell()
    .storeAddress(config.oldJettonMinter)
    .storeAddress(config.migrationMaster)
    .storeAddress(config.recipient)
    .storeRef(config.oldWalletCode || oldWalletCode)
    .endCell();
}

export function migrateBody(amount: BN): Cell {
  return beginCell().storeUint(OPS.Migrate, 32).storeUint(1, 64).storeCoins(amount).endCell();
}

export async function createMigrationMaster(
  config: MigrationMasterConfig,
  tonConnection: TonConnectUI,
  owner: Address,
): Promise<Address> {
  const contractDeployer = new ContractDeployer();
  const tc = await getClient();

  // params.onProgress?.(JettonDeployState.BALANCE_CHECK);
  const balance = await tc.getBalance(owner);
  if (balance.lt(MIGRATION_MASTER_DEPLOY_GAS))
    throw new Error("Not enough balance in deployer wallet");
  const params = {
    code: MIGRATION_MASTER_CODE,
    data: await migrationMasterConfigToCell(config),
    deployer: owner, //anything
    value: MIGRATION_MASTER_DEPLOY_GAS,
  };
  const migrationMasterAddress = new ContractDeployer().addressForContract(params);
  const isDeployed = tc.isContractDeployed(migrationMasterAddress);

  if (await tc.isContractDeployed(migrationMasterAddress)) {
    // params.onProgress?.(JettonDeployState.ALREADY_DEPLOYED);
  } else {
    await contractDeployer.deployContract(params, tonConnection);
    // params.onProgress?.(JettonDeployState.AWAITING_MINTER_DEPLOY);
    await waitForContractDeploy(migrationMasterAddress, tc);
  }

  return migrationMasterAddress;
}

export async function createMigrationHelper(
  config: MigrationHelperConfig,
  tonConnection: TonConnectUI,
  owner: Address,
): Promise<Address> {
  const contractDeployer = new ContractDeployer();
  const tc = await getClient();

  // params.onProgress?.(JettonDeployState.BALANCE_CHECK);
  const balance = await tc.getBalance(owner);
  if (balance.lt(MIGRATION_HELPER_DEPLOY_GAS))
    throw new Error("Not enough balance in deployer wallet");
  const params = {
    code: MIGRATION_HELPER_CODE,
    data: await migrationHelperConfigToCell(config),
    deployer: owner, //anything
    value: MIGRATION_HELPER_DEPLOY_GAS,
  };
  const migrationHelperAddress = new ContractDeployer().addressForContract(params);
  const isDeployed = tc.isContractDeployed(migrationHelperAddress);

  if (await tc.isContractDeployed(migrationHelperAddress)) {
    // params.onProgress?.(JettonDeployState.ALREADY_DEPLOYED);
  } else {
    console.log(123);
    await contractDeployer.deployContract(params, tonConnection);
    console.log(123);
    // params.onProgress?.(JettonDeployState.AWAITING_MINTER_DEPLOY);
    await waitForContractDeploy(migrationHelperAddress, tc);
    console.log(123);
  }

  return migrationHelperAddress;
}
