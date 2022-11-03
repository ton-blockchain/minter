import { persistenceType } from "lib/jetton-minter";
import BurnJettonsAction from "./actions/BurnJettonsAction";
import ConnectAction from "./actions/ConnectAction";
import MintJettonsAction from "./actions/MintJettonsAction";
import RevokeOwnershipAction from "./actions/RevokeOwnershipAction";
import { JettonDetailMessage } from "./types";

const commonGithubUrl =
  "https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users";

const offChainGithubUrl =
  "https://github.com/ton-defi-org/jetton-deployer-contracts#jetton-metadata-field-best-practices";

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
          remain safely in your wallet. [Read more](${commonGithubUrl})`,
    };
  }

  return {
    type: "warning",
    text: `This token is not 100% safe because admin has not revoked ownership. [Read more](${commonGithubUrl})`,
  };
};

export const getSymbolWarning = (
  persistenceType?: persistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `This can be changed by the admin without warning. [Read more](${commonGithubUrl})`,
    };
  }
  switch (persistenceType) {
    case "offchain_ipfs":
      return {
        type: "warning",
        text: `This jetton’s metadata (name and symbol) is stored on IPFS instead of on-chain. It will not change, but be careful, it can disappear and become unpinned. [Read more](${offChainGithubUrl})`,
      };
    case "offchain_private_domain":
      return {
        type: "warning",
        text: `Can be changed without warning by admin since metadata is stored on privately owned website. [Read more](${offChainGithubUrl})`,
      };

    default:
      return;
  }
};

export const getTotalSupplyWarning = (
  persistenceType?: persistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `The admin can mint more of this jetton without warning. [Read more](${commonGithubUrl})`,
    };
  }
};
