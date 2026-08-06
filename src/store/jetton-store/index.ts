import BN from "bn.js";
import { PersistenceType } from "lib/jetton-minter";
import { atom } from "recoil";

export interface JettonStoreState {
  isAdmin: boolean;
  adminRevokedOwnership: boolean;
  symbol?: string;
  decimals?: string;
  name?: string;
  jettonImage?: string;
  rawJettonImage?: string;
  rawJettonImageData?: string;
  metadataError?: string;
  isImageBroken?: boolean;
  description?: string;
  adminAddress?: string;
  balance?: BN;
  jettonMaster?: string;
  persistenceType?: PersistenceType;
  totalSupply?: BN;
  jettonWalletAddress?: string;
  isJettonDeployerFaultyOnChainData?: boolean;
  jettonLoading: boolean;
  isMyWallet: boolean;
  selectedWalletAddress?: string | null;
}

const jettonStateAtom = atom<JettonStoreState>({
  key: "jettonStateAtom",
  default: {
    jettonLoading: false,
    persistenceType: undefined,
    isAdmin: false,
    adminRevokedOwnership: true,
    symbol: undefined,
    decimals: undefined,
    name: undefined,
    jettonImage: undefined,
    rawJettonImage: undefined,
    rawJettonImageData: undefined,
    metadataError: undefined,
    isImageBroken: false,
    description: undefined,
    adminAddress: undefined,
    balance: undefined,
    jettonMaster: undefined,
    totalSupply: undefined,
    jettonWalletAddress: undefined,
    isJettonDeployerFaultyOnChainData: false,
    isMyWallet: false,
    selectedWalletAddress: undefined,
  },
});

export { jettonStateAtom };
