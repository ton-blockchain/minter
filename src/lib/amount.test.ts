import BN from "bn.js";
import { hasSufficientTokenBalance, parsePositiveTokenAmount } from "./amount";
import { toDecimalsBN } from "utils";

test("keeps token amounts exact beyond Number.MAX_SAFE_INTEGER", () => {
  expect(toDecimalsBN("9007199254740993", 9).toString()).toBe("9007199254740993000000000");
  expect(toDecimalsBN("123456789.123456789", 9).toString()).toBe("123456789123456789");
});

test("rejects silent rounding and non-positive operation amounts", () => {
  expect(() => toDecimalsBN("1.0000000001", 9)).toThrow("at most 9 decimal places");
  expect(() => parsePositiveTokenAmount("0", 9, "Burn")).toThrow(
    "Burn amount must be greater than zero",
  );
  expect(() => parsePositiveTokenAmount("-100", 9, "Mint")).toThrow(
    "Mint amount must be greater than zero",
  );
  expect(() => toDecimalsBN((Number.MAX_SAFE_INTEGER + 1) as any, 9)).toThrow("exact string");
});

test("compares burn amount with the already-atomic wallet balance", () => {
  const oneTokenRaw = new BN("1000000000");
  expect(hasSufficientTokenBalance(toDecimalsBN("1", 9), oneTokenRaw)).toBe(true);
  expect(hasSufficientTokenBalance(toDecimalsBN("2", 9), oneTokenRaw)).toBe(false);
});
