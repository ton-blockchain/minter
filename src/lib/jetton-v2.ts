import BN from "bn.js";
import { Address, beginCell, Cell, toNano } from "ton";

import artifact from "./contracts/jetton-v2-minter.compiled.json";
import {
  buildJettonOffChainMetadata,
  buildJettonOnchainMetadata,
  JettonMetaDataKeys,
} from "./jetton-minter";

// ton-blockchain/acton v1.1.0 Jetton template, commit 9cf4d1f.
export const JETTON_V2_MINTER_CODE_HASH =
  "6bf8f48ca97d3fd9c8e553344efe7af030c322459e2ee2197a052162f1961bfb";

const codeRoots = Cell.fromBoc(Buffer.from(artifact.code_boc64, "base64"));
if (
  artifact.hash.toLowerCase() !== JETTON_V2_MINTER_CODE_HASH ||
  codeRoots.length !== 1 ||
  codeRoots[0].hash().toString("hex") !== JETTON_V2_MINTER_CODE_HASH
) {
  throw new Error("Invalid Jetton v2.1 minter artifact");
}

export const JETTON_V2_MINTER_CODE = codeRoots[0];

export const JETTON_V2_DEPLOY_VALUE = toNano(0.15);
export const JETTON_V2_MINT_VALUE = toNano(0.1);
export const JETTON_V2_MINT_TO_WALLET_VALUE = toNano(0.05);
export const JETTON_V2_ADMIN_VALUE = toNano(0.05);
export const JETTON_V2_TRANSFER_VALUE = toNano(0.05);
export const JETTON_V2_BURN_VALUE = toNano(0.05);

const OPS = {
  Mint: 0x642b7d07,
  InternalTransfer: 0x178d4519,
  DropAdmin: 0x7431f221,
  ChangeMetadata: 0xcb862902,
};

export function isJettonV2Code(codeBoc: Buffer | null): boolean {
  if (!codeBoc) return false;

  try {
    const roots = Cell.fromBoc(codeBoc);
    return roots.length === 1 && roots[0].hash().toString("hex") === JETTON_V2_MINTER_CODE_HASH;
  } catch {
    return false;
  }
}

export function initJettonV2Data(
  owner: Address,
  data?: { [s in JettonMetaDataKeys]?: string | undefined },
  offchainUri?: string,
): Cell {
  if (!data && !offchainUri) {
    throw new Error("Must either specify onchain data or offchain uri");
  }

  return beginCell()
    .storeCoins(0)
    .storeAddress(owner)
    .storeAddress(null)
    .storeRef(
      offchainUri ? buildJettonOffChainMetadata(offchainUri) : buildJettonOnchainMetadata(data!),
    )
    .endCell();
}

export function mintJettonV2Body(
  recipient: Address,
  responseAddress: Address,
  jettonValue: BN,
  transferToJWallet: BN,
  queryId: number,
): Cell {
  return beginCell()
    .storeUint(OPS.Mint, 32)
    .storeUint(queryId, 64)
    .storeAddress(recipient)
    .storeCoins(transferToJWallet)
    .storeRef(
      beginCell()
        .storeUint(OPS.InternalTransfer, 32)
        .storeUint(queryId, 64)
        .storeCoins(jettonValue)
        .storeAddress(null)
        .storeAddress(responseAddress)
        .storeCoins(toNano(0.001))
        .storeBit(false)
        .endCell(),
    )
    .endCell();
}

export function dropJettonV2AdminBody(queryId: number): Cell {
  return beginCell().storeUint(OPS.DropAdmin, 32).storeUint(queryId, 64).endCell();
}

export function updateJettonV2MetadataBody(metadata: Cell, queryId: number): Cell {
  return beginCell()
    .storeUint(OPS.ChangeMetadata, 32)
    .storeUint(queryId, 64)
    .storeRef(metadata)
    .endCell();
}
