import { getErrorNotification } from "./error-notification";

test("turns a wallet rejection into a neutral cancellation message", () => {
  expect(
    getErrorNotification(
      new Error("[TON_CONNECT_SDK_ERROR] UserRejectsError: User rejects the action in the wallet."),
    ),
  ).toEqual({
    message: "Transaction cancelled. Nothing was sent.",
    variant: "info",
  });
});

test.each([
  [
    new Error("Wallet network does not match the network selected in the app"),
    "Your wallet is connected to a different network. Switch networks and try again.",
    "warning",
  ],
  [new Error("Wallet not connected"), "Connect your wallet and try again.", "warning"],
  [
    new Error("Not enough balance in deployer wallet"),
    "Your wallet does not have enough GRAM for this transaction and its fees.",
    "warning",
  ],
  [
    new Error("Not enough funds to send the transaction"),
    "Your wallet does not have enough GRAM for this transaction and its fees.",
    "warning",
  ],
  [
    { response: { status: 429 }, message: "Request failed" },
    "Toncenter is temporarily busy. Wait a moment and try again.",
    "warning",
  ],
  [
    { name: "AbortError", message: "The operation was aborted" },
    "The request timed out. Check your connection and try again.",
    "error",
  ],
  [
    { code: "ERR_NETWORK", message: "Network Error" },
    "Unable to reach the blockchain network. Check your connection and try again.",
    "error",
  ],
  [
    new Error("Request failed with status code 502"),
    "Unable to reach the blockchain network. Check your connection and try again.",
    "error",
  ],
  [
    { name: "TransactionOnchainError", message: "Transaction failed on-chain: exit code 37" },
    "The transaction failed on-chain. Check the explorer for details.",
    "error",
  ],
  [
    new Error("Unable to execute get method. Got exit_code: -13"),
    "Unable to read a jetton contract at this address. Check the selected network and address.",
    "error",
  ],
  [
    new Error("Unable to execute get method. Got exit_code: 11"),
    "This address does not contain a supported jetton contract.",
    "error",
  ],
])("maps a known runtime error", (error, message, variant) => {
  expect(getErrorNotification(error)).toEqual({ message, variant });
});

test("normalizes a controlled application error", () => {
  expect(
    getErrorNotification(new Error("Token metadata is incomplete; reload it before editing")),
  ).toEqual({
    message: "Token metadata is incomplete. Reload it before editing.",
    variant: "error",
  });
});

test("does not expose unknown technical errors", () => {
  expect(
    getErrorNotification(
      new TypeError("Cannot read properties of undefined (reading 'stack')"),
      "Unable to mint jettons. Please try again.",
    ),
  ).toEqual({
    message: "Unable to mint jettons. Please try again.",
    variant: "error",
  });
});

test("never exposes an unrecognized short error message", () => {
  expect(getErrorNotification(new Error("Request failed with status code 418"))).toEqual({
    message: "Something went wrong. Please try again.",
    variant: "error",
  });
});
