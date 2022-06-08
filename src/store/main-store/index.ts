import { atom } from "recoil";

export interface MainStore {
    showConnectModal: boolean;
}

const mainStateAtom = atom<MainStore>({
  key: "mainStateAtom",
  default: {
    showConnectModal: false,
  },
});



export {mainStateAtom}