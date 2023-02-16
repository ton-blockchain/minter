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
  { type: Providers.TONKEEPER },
  { type: Providers.TON_HUB },
  { type: Providers.OPEN_MASK },
  { type: Providers.EXTENSION },
];
