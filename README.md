# Minter - Webclient

An open source Jetton deployer webapp, based on the [Acton Contracts Jetton v2.1 source](https://github.com/ton-blockchain/acton-contracts/tree/92225ba47468edde6c86e0a68218b27f4b721890/jetton-v2.1/contracts).

## How to use

Instructions:
Make sure you have a TON wallet with at least 0.20 GRAM balance.

Use your web browser to open the site of the deploy form: https://minter.ton.org

To use the Testnet version open this link: https://minter.ton.org?testnet=true

> Safety Notice: The form is based on this repo and served from GitHub Pages

Click the "Connect Wallet" button to connect your wallet.

Fill in the information about your Jetton in the form - choose a name, ticker and image URL.

Deploy and approve the deploy transaction in your wallet.

Once the token is deployed, the deploying wallet will receive all the tokens that were minted, and the form will encourage you to revoke ownership.

## Jetton deployment fields and metadata best practices

- **Jetton Name** - The human-readable project name, usually one to three words. Names are not unique; always use the Jetton master address to identify a token.
- **Jetton Symbol** - The short ticker displayed next to balances, usually three to five uppercase characters. Symbols are not unique either.
- **Decimals** - The precision used to display token amounts. Nine is the conventional default. TON stores balances as integers, and this value determines how wallets and applications display them. Changing it later changes the interpretation of existing raw balances.
- **Tokens to Mint** - The initial token amount minted and sent to the connected wallet. Enter the displayed amount, such as `21000000`, rather than the integer representation adjusted for decimals. More tokens can be minted later while an admin is set.
- **Description** - An optional, concise explanation of the project. The public deploy form stores it on-chain with the other metadata fields.
- **Jetton Logo URL** - A direct URL to the token image. Use a stable HTTPS or IPFS location. A remote image can be changed, removed, or become unavailable independently of the contract.
- **Where metadata is stored** - The public deploy form writes the metadata fields on-chain. The application can also read Jettons that use off-chain or semi-chain metadata. Off-chain data depends on the continued availability and integrity of its URL; pinned IPFS content can still become unavailable if it is no longer hosted.

Verify every field and the initial supply before deploying. Contract-level metadata can only be updated while an admin is set, but content served by an off-chain URL may still change independently.

## Protect yourself and your users

- Review the pinned [Jetton v2.1 contract source](https://github.com/ton-blockchain/acton-contracts/tree/92225ba47468edde6c86e0a68218b27f4b721890/jetton-v2.1/contracts) before deploying.
- Always identify a Jetton by its master contract address. Anyone can reuse another token's name, symbol, description, or logo.
- While an admin is set, that address can mint additional tokens and update metadata through this application. At the contract level, the standard Jetton v2.1 code also allows the admin to nominate a successor and upgrade the contract code and data. Treat admin-controlled Jettons accordingly.
- Revoke ownership only after checking the deployed token and its metadata. In the standard, unmodified Jetton v2.1 contract, revocation is irreversible and permanently disables contract-level minting, metadata updates, admin succession, and upgrades. Data loaded from external URLs may still change independently.
- Before signing, verify that the connected wallet, selected network, destination address, amount, and operation shown by the wallet are correct.

## Forking / Running your own instance

> This project is based on [create-react-app](https://create-react-app.dev/).

Clone or fork the project

Run `npm install`

Run `npm start`

Open `http://localhost:3000`

## Is this tool safe?

The deployed Jetton v2.1 contract source is pinned to the [Acton Contracts Jetton v2.1 source](https://github.com/ton-blockchain/acton-contracts/tree/92225ba47468edde6c86e0a68218b27f4b721890/jetton-v2.1/contracts).

# License

MIT
