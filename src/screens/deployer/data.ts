const formSpec = [
  {
    name: "name",
    label: "Name",
    placeholder: "Choose a name for your token",
    type: "text",
    default: "MyJetton",
  },
  {
    name: "symbol",
    label: "Symbol",
    placeholder: "Choose a symbol for your token (usually 3-5 chars)",
    type: "text",
    inputStyle: { textTransform: "uppercase" },
    default: "JET",
  },
  {
    name: "initialSupply",
    label: "Initial supply",
    placeholder: "Initial supply of token. usually 0?",
    type: "number",
    disabled: true,
    default: 0,
  },
  {
    name: "mintAmount",
    label: "Mint Amount",
    placeholder: "Amount to mint",
    type: "number",
    default: 100,
  },

  {
    name: "maxSupply",
    label: "Max supply",
    placeholder: "Not yet supported",
    type: "number",
    disabled: true,
    default: 0,
  },
  {
    name: "decimals",
    label: "Token decimals",
    placeholder: "The decimal precision of your token",
    type: "number",
    disabled: true,
    default: 9,
  },

  {
    name: "mintToOwner",
    label: "Mint to owner",
    placeholder: "Amount of jetton to transfer to owner jwallet",
    type: "number",
    default: 100,
  },
  {
    name: "gasFee",
    label: "Gas fee",
    placeholder:
      "Amount of to send from your wallet to jetton contract for gas and rent",
    type: "number",
    disabled: true,
    default: 0.3,
  },
];

export { formSpec };
