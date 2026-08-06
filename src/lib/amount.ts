import BN from "bn.js";
import { toDecimalsBN } from "utils";

export function assertPositiveAmount(amount: BN, operation: string): void {
  if (amount.lte(new BN(0))) {
    throw new Error(`${operation} amount must be greater than zero`);
  }
}

export function parsePositiveTokenAmount(
  value: string,
  decimals: number | string,
  operation: string,
): BN {
  const amount = toDecimalsBN(value, decimals);
  assertPositiveAmount(amount, operation);
  return amount;
}

export function hasSufficientTokenBalance(amount: BN, rawBalance: BN): boolean {
  return amount.lte(rawBalance);
}
