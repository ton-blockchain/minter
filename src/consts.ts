import { Address } from "ton";
import { formatAddress, getCurrentNetwork } from "./lib/network";
const ROUTES = {
  deployer: "/",
  jetton: "/jetton",
  jettonId: "/jetton/:id",
};

const APP_GRID = 1156;

const LOCAL_STORAGE_PROVIDER = "wallet_provider";

const APP_DISPLAY_NAME = "TON MINTER";

const MINTER_GITHUB_URL = "https://github.com/ton-blockchain/minter";
const TELEGRAM_URL = "https://t.me/gram";
const MINTER_SAFETY_URL = `${MINTER_GITHUB_URL}#protect-yourself-and-your-users`;
const MINTER_METADATA_BEST_PRACTICES_URL = `${MINTER_GITHUB_URL}#jetton-deployment-fields-and-metadata-best-practices`;
const JETTON_V2_CONTRACTS_GITHUB_URL =
  "https://github.com/ton-blockchain/acton-contracts/tree/92225ba47468edde6c86e0a68218b27f4b721890/jetton-v2.1/contracts";

const EXAMPLE_ADDRESS =
  getCurrentNetwork() === "testnet"
    ? formatAddress(Address.parse("EQBP4L9h4272Z0j_w9PE2tjHhi8OwkrRbTmatKszMyseis05"), "testnet")
    : "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm";

const SEARCH_HISTORY = "searchHistory";

export {
  ROUTES,
  LOCAL_STORAGE_PROVIDER,
  APP_GRID,
  MINTER_GITHUB_URL,
  TELEGRAM_URL,
  MINTER_SAFETY_URL,
  MINTER_METADATA_BEST_PRACTICES_URL,
  JETTON_V2_CONTRACTS_GITHUB_URL,
  APP_DISPLAY_NAME,
  EXAMPLE_ADDRESS,
  SEARCH_HISTORY,
};
