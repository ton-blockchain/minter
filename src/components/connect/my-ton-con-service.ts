// import x from '@ton-defi.org/jetton-deployer-contracts'

import {
  ChromeExtensionWalletProvider,
  TonhubProvider,
  TonConnection,
} from "@ton-defi.org/ton-connection";

let tonCon: TonConnection;

export const getTonCon = (
  providerId: string,
  onLinkReady: (link: string) => void
) => {
  if (tonCon) return tonCon;


  let prov;

  if (providerId === "tonhub") {
    prov = new TonhubProvider({
      onSessionLinkReady: onLinkReady,
      isSandbox: false, // TODO sy
      persistenceProvider: localStorage,
    });
  } else if (providerId === "ton_wallet") {
    prov = new ChromeExtensionWalletProvider();
  } else {
    throw new Error("UNKNOWN PROVIDER");
  }

  tonCon = new TonConnection(prov, "..."); // todo sy
  return tonCon;
};
