import { TransactionDetails, Wallet, _TonWindowProvider } from "@ton-defi.org/ton-connection";

const TON_WALLET_EXTENSION_URL =
  "https://chrome.google.com/webstore/detail/openmask/penjlddjkjgpnkllboccdgccekpkcbin";

export interface _OpenMaskWindowProvider {
  isOpenMask: boolean;
  send<T>(method: string, params?: any[]): Promise<T>;
  on(eventName: string, handler: (...data: any[]) => any): void;
}

export interface OpenMaskWallet {
  address: string;
  publicKey: string;
  version: "v2R1" | "v2R2" | "v3R1" | "v3R2" | "v4R1" | "v4R2";
}

export class OpenMaskWalletProvider {
  public isOpenMask = true;
  private provider: _OpenMaskWindowProvider | undefined = undefined;

  constructor() {
    const ton = window.ton as _OpenMaskWindowProvider | undefined;
    if (ton && ton.isOpenMask) {
      this.provider = ton;
    }
  }

  check = async () => {
    if (!this.provider) {
      window.alert("OpenMask is not detected");
      throw new Error("OpenMask is not detected");
    }
  };

  async connect(): Promise<Wallet> {
    try {
      await this.check();
      const [wallet] = await this.provider!.send<OpenMaskWallet[]>("ton_requestWallets");

      if (!wallet) {
        throw new Error("TON Wallet is not configured.");
      }
      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        walletVersion: wallet.version,
      };
    } catch (error) {
      window.open(TON_WALLET_EXTENSION_URL, "_blank");
      throw error;
    }
  }
  async requestTransaction(request: TransactionDetails, onSuccess?: () => void): Promise<void> {
    try {
      await this.check();

      let seqNo: number;
      const { stateInit } = request;
      if (stateInit) {
        const { walletSeqNo } = await this.provider!.send<{
          walletSeqNo: number;
          newContractAddress: string;
        }>("ton_deployContract", [
          {
            initCodeCell: stateInit.code?.toBoc().toString("hex"),
            initDataCell: stateInit.data?.toBoc().toString("hex"),
            initMessageCell: request.message?.toBoc().toString("hex"),
            amount: request.value.toString(),
          },
        ]);
        seqNo = walletSeqNo;
      } else {
        seqNo = await this.provider!.send("ton_sendTransaction", [
          {
            to: request.to.toFriendly(),
            value: request.value.toString(),
            dataType: "hex",
            data: request.message?.toBoc().toString("hex"),
          },
        ]);
      }

      await this.provider!.send("ton_confirmWalletSeqNo", [seqNo]);

      onSuccess && onSuccess();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
