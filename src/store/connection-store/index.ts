import { atom, selector } from "recoil";
import { Wallet } from "@ton-defi.org/ton-connection";
import { Providers } from "lib/env-profiles";

export interface ConnectionStateAtom {
  address: string | null;
  wallet: Wallet | null;
  adapterId: Providers | null;
  isConnecting: boolean;
  showConnect: boolean;
}

const connectionStateAtom = atom<ConnectionStateAtom>({
  key: "connectionStateAtom",
  default: {
    address: null,
    wallet: null,
    adapterId: null,
    isConnecting: true,
    showConnect: false,
  },
});

const connectWalletSelector = selector<ConnectionStateAtom>({
  key: "connectWalletSelector",
  get: ({ get }) => get(connectionStateAtom),
  set: ({ set, get }, newValue: any) => {
    const state = get(connectionStateAtom);

    set(connectionStateAtom, {
      ...state,
      address: newValue.address,
      wallet: newValue.wallet,
    });
  },
});

export { connectionStateAtom, connectWalletSelector };
