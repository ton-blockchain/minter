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

const JETTON_DEPLOYER_CONTRACTS_GITHUB =
  "https://github.com/ton-blockchain/acton/tree/9cf4d1f410267178e943daf32b44353d99ddb6db/src/commands/new/templates/jetton/contracts";

const EXAMPLE_ADDRESS =
  getCurrentNetwork() === "testnet"
    ? formatAddress(Address.parse("EQBP4L9h4272Z0j_w9PE2tjHhi8OwkrRbTmatKszMyseis05"), "testnet")
    : "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm";

const SEARCH_HISTORY = "searchHistory";

export {
  ROUTES,
  LOCAL_STORAGE_PROVIDER,
  APP_GRID,
  JETTON_DEPLOYER_CONTRACTS_GITHUB,
  APP_DISPLAY_NAME,
  EXAMPLE_ADDRESS,
  SEARCH_HISTORY,
};
