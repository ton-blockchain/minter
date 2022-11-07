import BN from "bn.js";
import { persistenceType } from "lib/jetton-minter";
import { atom } from "recoil";

export interface JettonStoreState {
  isAdmin: boolean;
  adminRevokedOwnership: boolean;
  symbol?: string;
  decimals?: string;
  name?: string;
  jettonImage?: string;
  description?: string;
  adminAddress?: string;
  balance?: BN;
  jettonMaster?: string;
  persistenceType?: persistenceType;
  totalSupply?: BN;
  jettonAddress?: string;
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
    decimals: "9",
    name: undefined,
    jettonImage: undefined,
    description: undefined,
    adminAddress: undefined,
    balance: undefined,
    jettonMaster: undefined,
    totalSupply: undefined,
    jettonAddress: undefined,
    isJettonDeployerFaultyOnChainData: false,
    isMyWallet: false,
    selectedWalletAddress: undefined,
  },
});

export { jettonStateAtom };
