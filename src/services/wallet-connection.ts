import {
  ChromeExtensionWalletProvider,
  TonConnection,
  TonhubProvider,
  OpenMaskWalletProvider,
} from "@ton-defi.org/ton-connection";
import { Environments, EnvProfiles, Providers } from "lib/env-profiles";
import { Address } from "ton";

class WalletConnection {
  private static connection?: TonConnection;

  private constructor() {}

  public static getConnection() {
    if (!this.connection) {
      throw new Error("Connectiong missing");
    }
    return this.connection;
  }

  public static isContractDeployed(contractAddr: Address) {
    return this.connection?._tonClient.isContractDeployed(contractAddr);
  }

  public static async connect(
    providerId: Providers,
    onLinkReady: (link: string) => void,
    isTestnet: boolean,
    onTransactionLinkReady?: (link: string) => void,
  ) {
    let prov;

    switch (providerId) {
      case Providers.TON_HUB:
        prov = new TonhubProvider({
          onSessionLinkReady: onLinkReady,
          isSandbox: isTestnet,
          persistenceProvider: localStorage,
          onTransactionLinkReady,
        });
        break;
      case Providers.EXTENSION:
        prov = new ChromeExtensionWalletProvider();
        break;
      case Providers.OPEN_MASK:
        prov = new OpenMaskWalletProvider();
        break;
      default:
        throw new Error("UNKNOWN PROVIDER");
    }

    this.connection = new TonConnection(
      prov,
      EnvProfiles[isTestnet ? Environments.SANDBOX : Environments.MAINNET].rpcApi,
    );
    return this.connection.connect();
  }
}

export default WalletConnection;
