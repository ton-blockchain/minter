import { isValidAddress } from "utils";
import BN from "bn.js";
import BigNumberDisplay from "components/BigNumberDisplay";

export const validateTransfer = (
  toAddress?: string,
  amount?: BN,
  balance?: BN,
  symbol?: string,
  decimals?: string,
): string | undefined | JSX.Element => {
  if (!toAddress) {
    return "Recipient wallet address required";
  }

  if (toAddress && !isValidAddress(toAddress)) {
    return "Invalid Recipient wallet address";
  }

  if (!amount) {
    return "Transfer amount required";
  }

  if (amount.gt(balance!!)) {
    return (
      <>
        Maximum amount to transfer is <BigNumberDisplay value={balance!!} decimals={decimals} />{" "}
        {symbol}
      </>
    );
  }
};
