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
  isLoading: boolean
  jettonAddress?: string;
}

const jettonStateAtom = atom<JettonStoreState>({
  key: "jettonStateAtom",
  default: {
    isAdmin: false,
    adminRevokedOwnership: true,
    symbol: undefined,
    name: undefined,
    jettonImage: undefined,
    description: undefined,
    adminAddress: undefined,
    balance: undefined,
    isLoading: true,
    jettonAddress: undefined
  },
});

export { jettonStateAtom };
