import { isValidAddress } from "utils";
import { toNano } from "ton";
import BigNumberDisplay from "components/BigNumberDisplay";

export const getError = (
  toAddress?: string,
  amount?: number,
  balance?: string,
  symbol?: string,
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

  if (toNano(amount).gt(toNano(balance!!))) {
    return (
      <>
        Maximum amount to transfer is <BigNumberDisplay value={balance!!} /> {symbol}
      </>
    );
  }
};
