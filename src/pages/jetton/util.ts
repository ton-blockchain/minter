import { PersistenceType } from "lib/jetton-minter";
import BurnJettonsAction from "./actions/BurnJettonsAction";
import MintJettonsAction from "./actions/MintJettonsAction";
import RevokeOwnershipAction from "./actions/RevokeOwnershipAction";
import { JettonDetailMessage } from "./types";
import { MINTER_CONTRACT_METADATA_BEST_PRACTICES_URL, MINTER_CONTRACT_SAFETY_URL } from "consts";
export { BigNumber } from "bignumber.js";

export const getFaultyMetadataWarning = (isAdminRevokedOwnership?: boolean) => {
  if (isAdminRevokedOwnership) {
    return "This token was created with a previous faulty version of the tool. The token is permanently unusable, please contact the admin to redeploy a new token";
  }
  return "This token was created with a previous faulty version of the tool. The token is now unusable but can be fixed, please contact the admin to fix it using this page";
};

export const adminActions = [RevokeOwnershipAction];

export const totalSupplyActions = [MintJettonsAction];

export const balanceActions = [BurnJettonsAction];

export const getAdminMessage = (
  adminAddress?: string,
  symbol?: string,
  isRevokedOwnership?: boolean,
  isAdmin?: boolean,
  jettonAddress?: string,
): JettonDetailMessage | undefined => {
  if (!jettonAddress) {
    return undefined;
  }
  if (isRevokedOwnership) {
    return {
      type: "success",
      text: "Ownership is revoked",
    };
  }
  if (isAdmin) {
    return {
      type: "warning",
      text: `You should revoke this token's ownership. Your ${symbol} tokens will
          remain safely in your wallet. [Read more](${MINTER_CONTRACT_SAFETY_URL}).`,
    };
  }

  return {
    type: "warning",
    text: `This token is not 100% safe because admin has not revoked ownership. [Read more](${MINTER_CONTRACT_SAFETY_URL}).`,
  };
};

export const getMetadataWarning = (
  persistenceType?: PersistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `This can be changed by the admin without warning. [Read more](${MINTER_CONTRACT_SAFETY_URL}).`,
    };
  }
  switch (persistenceType) {
    case "offchain_ipfs":
      return {
        type: "warning",
        text: `This jetton’s metadata (name, decimals and symbol) is stored on IPFS instead of on-chain. It will not change, but be careful, it can disappear and become unpinned. [Read more](${MINTER_CONTRACT_METADATA_BEST_PRACTICES_URL}).`,
      };
    case "offchain_private_domain":
      return {
        type: "warning",
        text: `Can be changed without warning by admin since metadata is stored on privately owned website. [Read more](${MINTER_CONTRACT_METADATA_BEST_PRACTICES_URL}).`,
      };

    default:
      return;
  }
};

export const getTotalSupplyWarning = (
  persistenceType?: PersistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `The admin can mint more of this jetton without warning. [Read more](${MINTER_CONTRACT_SAFETY_URL})`,
    };
  }
};
