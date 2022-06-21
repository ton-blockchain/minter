import { JettonWalletState, MinterState } from "./types";

const createJettonDetailsContent = (
    minter: MinterState,
    jettonWallet: JettonWalletState
  ) => {
    return [
      {
        title: "Name:",
        value: minter.name,
      },
      {
        title: "Symbol:",
        value: minter.symbol,
      },
  
      {
        title: "Description:",
        value: minter.description,
      },
      {
        title: "Balance:",
        value: `${jettonWallet.balance} ${minter.symbol}s`,
      },
      {
        title: "Jetton Wallet:",
        value: jettonWallet.jWalletAddress,
        isAddress: true,
      },
      {
        title: "Jetton Master:",
        value: jettonWallet.jettonMasterAddress,
        isAddress: true,
      },
    ];
  };

  export {createJettonDetailsContent}