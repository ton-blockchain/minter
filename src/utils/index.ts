export const scannerUrl = (isSandbox?: boolean) => {
  if (isSandbox) {
    return `https://sandbox.tonwhales.com/explorer/address`;
  }

  return `https://tonscan.org/jetton`;
};
