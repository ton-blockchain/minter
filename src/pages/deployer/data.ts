import { checkImageURL } from "helpers";


const formSpec = [
  {
    name: "name",
    label: "Jetton Name",
    description: "Choose a name for your token",
    type: "text",
    default: "MyJetton",
    required: true,
    errorMessage: 'Name required'
  },
  {
    name: "symbol",
    label: "Jetton Symbol",
    description: "Choose a symbol for your token (usually 3-5 chars)",
    type: "text",
    default: "JET",
    required: true,
    errorMessage: 'Symbol required'
  },
  {
    name: "decimals",
    label: "Jetton decimals",
    description: "The decimal precision of your token",
    type: "number",
    disabled: true,
    default: 9,
    required: false,

  },
  {
    name: "mintAmount",
    label: "Amount to mint",
    description: "The amount to mint",
    type: "number",
    default: 100,
    required: true,
    errorMessage: 'Mint amount required'

  },
  {
    name: "description",
    label: "Description",
    description: "Jetton description",
    type: "string",
    default: "My jetton description",
  },


  {
    name: "tokenImage",
    label: "Jetton logo URI",
    description: "Image of the jetton (png/jpg/jpeg/svg)",
    type: "string",
    required: false,
    validate: checkImageURL,
    default: "https://www.linkpicture.com/q/download_183.png"
  },
];

export { formSpec };
