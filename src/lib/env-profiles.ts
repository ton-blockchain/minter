interface Env {
  rpcApi: string;
  deepLinkPrefix: string;
}

export enum Environments {
  MAINNET,
  TESTNET,
  SANDBOX,
}

export enum Providers {
  TON_HUB = "tonhub",
  EXTENSION = "ton_wallet",
  TONKEEPER = "tonkeeper",
  OPEN_MASK = "open_mask",
}
export const providers: { type: Providers }[] = [
  { type: Providers.TON_HUB },
  { type: Providers.EXTENSION },
  { type: Providers.TONKEEPER },
  { type: Providers.OPEN_MASK },
];

export const EnvProfiles = {
  [Environments.MAINNET]: {
    rpcApi: "https://scalable-api.tonwhales.com/jsonRPC",
    deepLinkPrefix: "ton",
  },
  [Environments.TESTNET]: {
    rpcApi: "http://localhost:8080/https://testnet.toncenter.com/api/v2/jsonRPC",
    deepLinkPrefix: "n/a",
  },
  [Environments.SANDBOX]: {
    rpcApi: "https://sandbox.tonhubapi.com/jsonRPC",
    deepLinkPrefix: "ton-test",
  },
};

// "https://testnet-api.scaleton.io"
