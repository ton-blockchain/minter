import BN from "bn.js";
import { Cell, beginCell, Address, beginDict, Slice, toNano } from "ton";

import walletHex from "./contracts/jetton-wallet.compiled.json";
import minterHex from "./contracts/jetton-minter.compiled.json";
// @ts-ignore
import { Sha256 } from "@aws-crypto/sha256-js";

const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;
const SNAKE_PREFIX = 0x00;

export const JETTON_WALLET_CODE = Cell.fromBoc(walletHex.hex)[0];
export const JETTON_MINTER_CODE = Cell.fromBoc(minterHex.hex)[0]; // code cell from build output

enum OPS {
  ChangeAdmin = 3,
  ReplaceMetadata = 4,
  Mint = 21,
  InternalTransfer = 0x178d4519,
  Transfer = 0xf8a7ea5,
  Burn = 0x595f07bc,
}

export type JettonMetaDataKeys =
  | "name"
  | "description"
  | "image"
  | "symbol"
  | "image_data"
  | "decimals"
  | "uri";

const jettonOnChainMetadataSpec: {
  [key in JettonMetaDataKeys]: "utf8" | "ascii" | undefined;
} = {
  name: "utf8",
  description: "utf8",
  image: "ascii",
  decimals: "utf8",
  symbol: "utf8",
  image_data: undefined,
  uri: "ascii",
};

const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
};

export function buildJettonOnchainMetadata(data: { [s: string]: string | undefined }): Cell {
  const KEYLEN = 256;
  const dict = beginDict(KEYLEN);

  Object.entries(data).forEach(([k, v]: [string, string | undefined]) => {
    if (!jettonOnChainMetadataSpec[k as JettonMetaDataKeys])
      throw new Error(`Unsupported onchain key: ${k}`);
    if (v === undefined || v === "") return;

    let bufferToStore = Buffer.from(v, jettonOnChainMetadataSpec[k as JettonMetaDataKeys]);

    const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

    const rootCell = new Cell();
    rootCell.bits.writeUint8(SNAKE_PREFIX);
    let currentCell = rootCell;

    while (bufferToStore.length > 0) {
      currentCell.bits.writeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));
      bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);
      if (bufferToStore.length > 0) {
        let newCell = new Cell();
        currentCell.refs.push(newCell);
        currentCell = newCell;
      }
    }

    dict.storeRef(sha256(k), rootCell);
  });

  return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict.endDict()).endCell();
}

export function buildJettonOffChainMetadata(contentUri: string): Cell {
  return beginCell()
    .storeInt(OFFCHAIN_CONTENT_PREFIX, 8)
    .storeBuffer(Buffer.from(contentUri, "ascii"))
    .endCell();
}

export type PersistenceType = "onchain" | "offchain_private_domain" | "offchain_ipfs";

export async function readJettonMetadata(contentCell: Cell): Promise<{
  persistenceType: PersistenceType;
  metadata: { [s in JettonMetaDataKeys]?: string };
  isJettonDeployerFaultyOnChainData?: boolean;
  metadataError?: string;
}> {
  try {
    const contentSlice = contentCell.beginParse();

    switch (contentSlice.readUint(8).toNumber()) {
      case ONCHAIN_CONTENT_PREFIX: {
        const res = parseJettonOnchainMetadata(contentSlice);

        if (!res.metadata.uri) {
          return { persistenceType: "onchain", ...res };
        }

        const persistenceType = isIpfsUri(res.metadata.uri)
          ? "offchain_ipfs"
          : "offchain_private_domain";
        try {
          const offchainMetadata = await fetchJettonMetadata(res.metadata.uri);
          return {
            persistenceType,
            ...res,
            metadata: { ...res.metadata, ...offchainMetadata.metadata },
          };
        } catch (error) {
          return {
            persistenceType,
            ...res,
            metadataError: metadataErrorMessage(error),
          };
        }
      }
      case OFFCHAIN_CONTENT_PREFIX: {
        const uri = contentSlice.readRemainingBytes().toString("ascii");
        const persistenceType = isIpfsUri(uri) ? "offchain_ipfs" : "offchain_private_domain";
        try {
          const { metadata } = await fetchJettonMetadata(uri);
          return { persistenceType, metadata };
        } catch (error) {
          return {
            persistenceType,
            metadata: {},
            metadataError: metadataErrorMessage(error),
          };
        }
      }
      default:
        throw new Error("Unexpected jetton metadata content prefix");
    }
  } catch (error) {
    return {
      persistenceType: "onchain",
      metadata: {},
      metadataError: metadataErrorMessage(error),
    };
  }
}

function metadataErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    error &&
    typeof error === "object" &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Unable to load jetton metadata";
}

function isIpfsUri(uri: string): boolean {
  return uri.startsWith("ipfs://") || /(^|\/)ipfs[.:/]/i.test(uri);
}

export function resolveJettonMetadataUri(uri: string): string {
  return /^ipfs:\/\//i.test(uri) ? `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}` : uri;
}

export function resolveJettonDecimals(
  metadataDecimals: string | undefined,
  metadataError: string | undefined,
): string | undefined {
  if (metadataDecimals !== undefined && metadataDecimals !== "") return metadataDecimals;
  return metadataError ? undefined : "9";
}

function sanitizeMetadata(data: unknown): { [s in JettonMetaDataKeys]?: string } {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Jetton metadata must be a JSON object");
  }
  const result: { [s in JettonMetaDataKeys]?: string } = {};
  for (const key of Object.keys(jettonOnChainMetadataSpec) as JettonMetaDataKeys[]) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string") result[key] = value;
  }
  return result;
}

export async function fetchJettonMetadata(uri: string, fetchImpl: typeof fetch = fetch) {
  const jsonURI = resolveJettonMetadataUri(uri);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetchImpl(jsonURI, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Unable to load jetton metadata (HTTP ${response.status})`);
    }
    return {
      metadata: sanitizeMetadata(await response.json()),
      isIpfs: isIpfsUri(uri),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parseJettonOnchainMetadata(contentSlice: Slice): {
  metadata: { [s in JettonMetaDataKeys]?: string };
  isJettonDeployerFaultyOnChainData: boolean;
} {
  // Note that this relies on what is (perhaps) an internal implementation detail:
  // "ton" library dict parser converts: key (provided as buffer) => BN(base10)
  // and upon parsing, it reads it back to a BN(base10)
  // tl;dr if we want to read the map back to a JSON with string keys, we have to convert BN(10) back to hex
  const toKey = (str: string) => new BN(str, "hex").toString(10);
  const KEYLEN = 256;

  let isJettonDeployerFaultyOnChainData = false;

  const dict = contentSlice.readDict(KEYLEN, (s) => {
    let buffer = Buffer.from("");

    const sliceToVal = (s: Slice, v: Buffer, isFirst: boolean) => {
      s.toCell().beginParse();
      if (isFirst && s.readUint(8).toNumber() !== SNAKE_PREFIX)
        throw new Error("Only snake format is supported");

      v = Buffer.concat([v, s.readRemainingBytes()]);
      if (s.remainingRefs === 1) {
        v = sliceToVal(s.readRef(), v, false);
      }

      return v;
    };

    if (s.remainingRefs === 0) {
      isJettonDeployerFaultyOnChainData = true;
      return sliceToVal(s, buffer, true);
    }

    return sliceToVal(s.readRef(), buffer, true);
  });

  const res: { [s in JettonMetaDataKeys]?: string } = {};

  Object.keys(jettonOnChainMetadataSpec).forEach((k) => {
    const val = dict
      .get(toKey(sha256(k).toString("hex")))
      ?.toString(jettonOnChainMetadataSpec[k as JettonMetaDataKeys]);
    if (val) res[k as JettonMetaDataKeys] = val;
  });

  return {
    metadata: res,
    isJettonDeployerFaultyOnChainData,
  };
}

export function initData(
  owner: Address,
  data?: { [s in JettonMetaDataKeys]?: string | undefined },
  offchainUri?: string,
) {
  if (!data && !offchainUri) {
    throw new Error("Must either specify onchain data or offchain uri");
  }
  return beginCell()
    .storeCoins(0)
    .storeAddress(owner)
    .storeRef(
      offchainUri ? buildJettonOffChainMetadata(offchainUri) : buildJettonOnchainMetadata(data!),
    )
    .storeRef(JETTON_WALLET_CODE)
    .endCell();
}

export function mintBody(
  owner: Address,
  jettonValue: BN,
  transferToJWallet: BN,
  queryId: number,
): Cell {
  return beginCell()
    .storeUint(OPS.Mint, 32)
    .storeUint(queryId, 64) // queryid
    .storeAddress(owner)
    .storeCoins(transferToJWallet)
    .storeRef(
      // internal transfer message
      beginCell()
        .storeUint(OPS.InternalTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(jettonValue)
        .storeAddress(null)
        .storeAddress(owner)
        .storeCoins(toNano(0.001))
        .storeBit(false) // forward_payload in this slice, not separate cell
        .endCell(),
    )
    .endCell();
}

export function burn(amount: BN, responseAddress: Address) {
  return beginCell()
    .storeUint(OPS.Burn, 32) // action
    .storeUint(1, 64) // query-id
    .storeCoins(amount)
    .storeAddress(responseAddress)
    .storeDict(null)
    .endCell();
}

export function transfer(to: Address, from: Address, jettonAmount: BN) {
  return beginCell()
    .storeUint(OPS.Transfer, 32)
    .storeUint(1, 64)
    .storeCoins(jettonAmount)
    .storeAddress(to)
    .storeAddress(from)
    .storeBit(false)
    .storeCoins(toNano(0.001))
    .storeBit(false) // forward_payload in this slice, not separate cell
    .endCell();
}

export function changeAdminBody(newAdmin: Address): Cell {
  return beginCell()
    .storeUint(OPS.ChangeAdmin, 32)
    .storeUint(0, 64) // queryid
    .storeAddress(newAdmin)
    .endCell();
}

export function updateMetadataBody(metadata: Cell): Cell {
  return beginCell()
    .storeUint(OPS.ReplaceMetadata, 32)
    .storeUint(0, 64) // queryid
    .storeRef(metadata)
    .endCell();
}
