import { checkImageURL, checkDecimals } from "helpers";

const onchainFormSpec = [
  {
    name: "name",
    label: "Jetton Name",
    description: "Your project unabbreviated name with spaces (usually 1-3 words).",
    type: "text",
    default: "Bitcoin Cash",
    required: true,
    errorMessage: "Name required",
  },
  {
    name: "symbol",
    label: "Jetton Symbol",
    description: "Currency symbol appearing in balance (usually 3-5 uppercase chars).",
    type: "text",
    default: "BCH",
    required: true,
    errorMessage: "Symbol required",
  },
  {
    name: "decimals",
    label: "Jetton Decimals",
    description: "The decimal precision of your token (9 is TON default).",
    type: "number",
    validate: checkDecimals,
    default: 9,
    showDefault: true,
    required: true,
    errorMessage: "Decimals amount from 0 to 255 is required", // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
  },
  {
    name: "mintAmount",
    label: "Tokens to Mint",
    description: "Number of initial tokens to mint and send to your wallet address (float).",
    type: "number",
    default: 21000000,
    required: true,
    errorMessage: "Mint amount required",
  },
  {
    name: "description",
    label: "Description",
    description: "Optional sentence explaining about your project.",
    type: "string",
    default: "Low fee peer-to-peer electronic cash alternative to Bitcoin",
  },

  {
    name: "tokenImage",
    label: "Jetton Logo URL",
    description: "URL of 256x256 pixel PNG image of token logo with transparent background.",
    type: "string",
    required: false,
    validate: checkImageURL,
    default: "https://bitcoincash-example.github.io/website/logo.png",
  },
];

const offchainFormSpec = [
  {
    name: "offchainUri",
    label: "Offchain URI",
    description: "JSON containing metadata. Don't forget to pin it if it's ipfs",
    type: "string",
    default: "",
    required: true,
    errorMessage: "URI required",
  },
  {
    name: "mintAmount",
    label: "Amount to Mint",
    description: "Number of initial tokens to mint and send to your wallet address (float)",
    type: "number",
    default: 21000000,
    required: true,
    errorMessage: "Mint amount required",
    disabled: undefined,
  },
];

export { onchainFormSpec, offchainFormSpec };
