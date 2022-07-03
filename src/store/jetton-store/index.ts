import { persistenceType } from "lib/jetton-minter";
import { atom } from "recoil";

interface JettonStoreState {
  isAdmin: boolean;
  adminRevokedOwnership: boolean;
  symbol?: string;
  name?: string;
  jettonImage?: string;
  description?: string;
  adminAddress?: string;
  balance?: string;
  jettonMaster?: string;
  persistenceType?: persistenceType;
  totalSupply?: string;
  jettonAddress?: string;
  isJettonDeployerFaultyOnChainData?: boolean;
}

const jettonStateAtom = atom<JettonStoreState>({
  key: "jettonStateAtom",
  default: {
    persistenceType: undefined,
    isAdmin: false,
    adminRevokedOwnership: true,
    symbol: undefined,
    name: undefined,
    jettonImage: undefined,
    description: undefined,
    adminAddress: undefined,
    balance: undefined,
    jettonMaster: undefined,
    totalSupply: undefined,
    jettonAddress: undefined,
    isJettonDeployerFaultyOnChainData: false
  },
});

export { jettonStateAtom };
