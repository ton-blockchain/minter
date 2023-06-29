import BN from "bn.js";
import { Cell, beginCell, Address, beginDict, Slice, toNano } from "ton";

import masterHex from "./contracts/MigrationMaster.compiled.json";
import helperHex from "./contracts/MigrationHelper.compiled.json";
// @ts-ignore
import { Sha256 } from "@aws-crypto/sha256-js";
import axios from "axios";
import { getClient } from "./get-ton-client";

export const MIGRATION_MASTER_CODE = Cell.fromBoc(masterHex.hex)[0];
export const MIGRATION_HELPER_CODE = Cell.fromBoc(helperHex.hex)[0]; // code cell from build output

enum OPS {
  Migrate = 0x79e4748e,
}

export type MigrationMasterConfig = {
  oldJettonMinter: Address;
  newJettonMinter: Address;
  oldWalletCode?: Cell;
  newWalletCode?: Cell;
};

export async function migrationMasterConfigToCell(config: MigrationMasterConfig): Promise<Cell> {
  const client = await getClient();
  const oldWalletCode = (await client.callGetMethod(config.oldJettonMinter, "get_jetton_data"))
    .stack[4];
  const newWalletCode = (await client.callGetMethod(config.newJettonMinter, "get_jetton_data"))
    .stack[4];

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
  const oldWalletCode = (await client.callGetMethod(config.oldJettonMinter, "get_jetton_data"))
    .stack[4];
  return beginCell()
    .storeAddress(config.oldJettonMinter)
    .storeAddress(config.migrationMaster)
    .storeAddress(config.recipient)
    .storeRef(config.oldWalletCode || oldWalletCode)
    .endCell();
}
