# Minter - Webclient

An open source Jetton deployer webapp, based on the [Acton Contracts Jetton v2.1 source](https://github.com/ton-blockchain/acton-contracts/tree/92225ba47468edde6c86e0a68218b27f4b721890/jetton-v2.1/contracts).

## How to use

Instructions:
Make sure you have a TON wallet with at least 0.20 TON balance.

Use your web browser to open the site of the deploy form: https://minter.ton.org

To use the Testnet version open this link: https://minter.ton.org?testnet=true

> Safety Notice: The form is based on this repo and served from GitHub Pages

Click the "Connect Wallet" button to connect your wallet.

Fill in the information about your Jetton in the form - choose a name, ticker and image URL.

Deploy and approve the deploy transaction in your wallet.

Once the token is deployed, the deploying wallet will receive all the tokens that were minted, and the form will encourage you to revoke ownership.

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
