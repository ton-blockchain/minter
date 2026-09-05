export type ErrorNotificationVariant = "error" | "warning" | "info";

export interface ErrorNotification {
  message: string;
  variant: ErrorNotificationVariant;
}

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  code?: unknown;
  status?: unknown;
  response?: { status?: unknown };
};

type ErrorRule = [RegExp, string, ErrorNotificationVariant];

const ERROR_RULES: ErrorRule[] = [
  [
    /userrejectserror|user rejects|user rejected|transaction (?:was )?cancelled|transaction was not sent/,
    "Transaction cancelled. Nothing was sent.",
    "info",
  ],
  [
    /network does not match|different network|selected network changed|request network/,
    "Your wallet is connected to a different network. Switch networks and try again.",
    "warning",
  ],
  [
    /connected wallet changed/,
    "The connected wallet changed. Review the transaction and try again.",
    "warning",
  ],
  [
    /walletnotconnectederror|wallet not connected|connect wallet to send/,
    "Connect your wallet and try again.",
    "warning",
  ],
  [
    /another transaction is already in progress/,
    "Another transaction is already in progress. Wait for it to finish.",
    "warning",
  ],
  [
    /not enough (?:balance|funds|ton|gram)|insufficient (?:funds|balance|ton|gram)/,
    "Your wallet does not have enough GRAM for this transaction and its fees.",
    "warning",
  ],
  [
    /walletnotsupportfeatureerror|wallet.*(?:does not|doesn't) support/,
    "Your wallet does not support this transaction.",
    "error",
  ],
  [
    /\b429\b|too many requests|rate.?limit/,
    "Toncenter is temporarily busy. Wait a moment and try again.",
    "warning",
  ],
  [
    /aborterror|timed? ?out|timeout|etimedout|econnaborted/,
    "The request timed out. Check your connection and try again.",
    "error",
  ],
  [
    /failed to fetch|network ?error|err_network|econnreset|lite_server_network|(?:http|status code) 5\d\d/,
    "Unable to reach the blockchain network. Check your connection and try again.",
    "error",
  ],
  [
    /transactiononchainerror|failed on-chain|did not execute the transaction/,
    "The transaction failed on-chain. Check the explorer for details.",
    "error",
  ],
  [
    /unable to execute get method.*exit_code:\s*-13/,
    "Unable to read a jetton contract at this address. Check the selected network and address.",
    "error",
  ],
  [
    /unable to execute get method.*exit_code:\s*(?:11|32)/,
    "This address does not contain a supported jetton contract.",
    "error",
  ],
  [
    /unable to execute get method|call get method/,
    "Unable to read data from this contract. Check the selected network and address.",
    "error",
  ],
  [
    /badrequesterror|request to the wallet contains errors/,
    "The wallet could not process this transaction. Reconnect it and try again.",
    "error",
  ],
  [
    /\[ton_connect|tonconnect\w*error/,
    "The wallet could not process the request. Please try again.",
    "error",
  ],
  [/invalid jetton address in query param/, "The URL contains an invalid wallet address.", "error"],
  [/^invalid jetton address$/, "Enter a valid jetton address.", "error"],
  [/wallet address in invalid/, "Enter a valid wallet address.", "error"],
  [/^page not found$/, "Page not found.", "error"],
  [
    /token metadata contains invalid decimals/,
    "Token metadata contains invalid decimals; amount operations are disabled.",
    "error",
  ],
  [/jetton decimals must be an integer/, "Jetton decimals must be an integer.", "error"],
  [
    /jetton decimals must be between 0 and 255/,
    "Jetton decimals must be between 0 and 255.",
    "error",
  ],
  [
    /jetton master address is unavailable/,
    "The jetton contract address is unavailable. Reload and try again.",
    "error",
  ],
  [
    /token metadata is incomplete/,
    "Token metadata is incomplete. Reload it before editing.",
    "error",
  ],
  [
    /token metadata cannot be safely rewritten/,
    "Token metadata cannot be updated safely from the loaded data.",
    "error",
  ],
  [
    /deployment transaction was not submitted/,
    "The deployment transaction was not submitted. Please try again.",
    "error",
  ],
  [
    /jetton wallet reports a different master contract/,
    "This jetton wallet belongs to a different jetton contract.",
    "error",
  ],
  [
    /jetton wallet reports a different owner/,
    "This jetton wallet belongs to a different owner.",
    "error",
  ],
  [
    /jetton metadata|metadata.*http|unexpected jetton metadata|only snake format/,
    "Unable to load token metadata. Check the metadata and try again.",
    "error",
  ],
  [
    /(?:http|status code) (?:400|401|403)/,
    "The blockchain data service rejected the request. Please try again later.",
    "error",
  ],
];

function describeError(error: unknown): string {
  const candidate = (error && typeof error === "object" ? error : {}) as ErrorLike;
  const message =
    typeof error === "string"
      ? error
      : typeof candidate.message === "string"
      ? candidate.message
      : "";
  const name = typeof candidate.name === "string" ? candidate.name : "";
  const code = typeof candidate.code === "string" ? candidate.code : "";
  const status = candidate.response?.status ?? candidate.status ?? "";
  return `${name} ${code} ${status} ${message}`.trim().toLowerCase();
}

export function getErrorNotification(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): ErrorNotification {
  const description = describeError(error);
  const rule = ERROR_RULES.find(([pattern]) => pattern.test(description));
  return rule ? { message: rule[1], variant: rule[2] } : { message: fallback, variant: "error" };
}
