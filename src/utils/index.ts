import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import { zeroAddress } from "lib/utils";
import { Address } from "ton";
import { Network, NETWORK_CONFIG } from "lib/network";

export const scannerUrl = (network: Network, isSandbox?: boolean, regularAddress?: boolean) => {
  if (isSandbox) {
    return `https://sandbox.tonwhales.com/explorer/address`;
  }

  if (regularAddress) {
    return `${NETWORK_CONFIG[network].explorer}/address`;
  }

  return `${NETWORK_CONFIG[network].explorer}/jetton`;
};

export const getUrlParam = (name: string) => {
  const query = new URLSearchParams(window.location.search);
  return query.get(name);
};

export const isValidAddress = (address: string, errorText?: string) => {
  try {
    const result = Address.parse(address);
    if (result && result.equals(zeroAddress())) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const ten = new BigNumber(10);

export function toDecimalsBN(num: string, decimals: number | string) {
  const decimalsNumber = Number(decimals);
  if (!Number.isInteger(decimalsNumber) || decimalsNumber < 0 || decimalsNumber > 255) {
    throw new Error("Token decimals must be an integer from 0 to 255");
  }

  if (typeof num !== "string") {
    throw new Error("Token amount must be provided as an exact string");
  }

  const value = new BigNumber(num);
  if (!value.isFinite() || value.isNaN()) throw new Error("Invalid token amount");
  const atomic = value.multipliedBy(ten.pow(decimalsNumber));
  if (!atomic.isInteger()) {
    throw new Error(`Amount supports at most ${decimalsNumber} decimal places`);
  }
  return new BN(atomic.toFixed(0));
}

export function fromDecimals(num: number | string, decimals: number | string) {
  return BigNumber(num).div(ten.pow(decimals)).toFixed();
}

export const onConnect = () => {
  const container = document.getElementById("ton-connect-button");
  const btn = container?.querySelector("button");

  if (btn) {
    btn.click();
  }
};
