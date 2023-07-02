# Minter - Webclient

An open source Jetton deployer webapp, based on [jetton contracts starter template](https://github.com/ton-blockchain/minter-contract).

## How to use

Instructions:
Make sure you have a TON wallet with at least 0.25 TON balance. Supported wallets include TonHub and Chrome Extension.

Use your web browser to open the site of the deploy form: https://minter.ton.org

> Safety Notice: The form is based on this repo and served from GitHub Pages

Click the "Connect Wallet" button to connect your wallet.

Fill in the information about your Jetton in the form - choose a name, ticker and image URI.

Deploy and approve the deploy transaction in your wallet.

Once the token is deployed, the deploying wallet will receive all the tokens that were minted, and the form will encourage you to revoke ownership.

## Forking / Running your own instance

> This project is based on [create-react-app](https://create-react-app.dev/).

Clone or fork the project

Run `npm install`

Run `npm start`

Open `http://localhost:3000`

## Is this tool safe?

Yes. See https://github.com/ton-blockchain/minter-contract#qa-is-this-contract-deployer-safe

# License

MIT
