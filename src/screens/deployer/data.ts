function checkURL(url: string) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}


const formSpec = [
  {
    name: "name",
    label: "Jetton Name",
    placeholder: "Choose a name for your token",
    type: "text",
    default: "MyJetton",
    required: true,
    errorMessage: 'Name required'
  },
  {
    name: "symbol",
    label: "Jetton Symbol",
    placeholder: "Choose a symbol for your token (usually 3-5 chars)",
    type: "text",
    inputStyle: { textTransform: "uppercase" },
    default: "JET",
    required: true,
    errorMessage: 'Symbol required'
  },
  {
    name: "decimals",
    label: "Jetton decimals",
    placeholder: "The decimal precision of your token",
    type: "number",
    disabled: true,
    default: 9,
    required: false,

  },
  {
    name: "mintAmount",
    label: "Amount to mint",
    placeholder: "The amount to mint",
    type: "number",
    default: 100,
    required: true,
    errorMessage: 'Mint amount required'

  },
  {
    name: "description",
    label: "Description",
    placeholder: "Jetton description",
    type: "string",
    default: "My jetton description",
  },


  {
    name: "tokenImage",
    label: "Jetton logo URI",
    placeholder: "Image of the jetton",
    type: "string",
    required: false,
    example: false,
    validate: checkURL,
    default: "https://www.linkpicture.com/q/download_183.png"
  },
];

export { formSpec };
