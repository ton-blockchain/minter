export type MinterState = {
    admin: string;
    symbol?: string | undefined;
    image?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
  };
  
  export type JettonWalletState = {
    balance: string;
    jWalletAddress: string;
    jettonMasterAddress: string;
  };