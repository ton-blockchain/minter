import { zeroAddress } from "lib/utils";
import { Address } from "ton";

export const scannerUrl = (isSandbox?: boolean) => {
  if (isSandbox) {
    return `https://sandbox.tonwhales.com/explorer/address`;
  }

  return `https://tonscan.org/jetton`;
};

export const getUrlParam = (name: string) => {
  const query = new URLSearchParams(window.location.search);
  return query.get(name);
};

export const isValidAddress = (address: string, errorText?: string) => {
  try {
    const result = Address.parse(address);
    if (result && result.toFriendly() === zeroAddress().toFriendly()) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
