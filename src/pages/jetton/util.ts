import { persistenceType } from "lib/jetton-minter";
import { scannerUrl } from "utils";
import { JettonDetailMessage } from "./types";
const commonGithubUrl =
  "https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users";

const offChainGithubUrl =
  "https://github.com/ton-defi-org/jetton-deployer-contracts#jetton-metadata-field-best-practices";

const getAdminMessage = (
  adminAddress?: string,
  symbol?: string,
  isRevokedOwnership?: boolean,
  isAdmin?: boolean,
  jettonAddress?: string
): JettonDetailMessage | undefined => {
  const adminUrl = `${scannerUrl()}/${adminAddress}`;

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
          remain safely in your [jetton wallet](${adminUrl}). [Read more](${commonGithubUrl})`,
    };
  }

  return {
    type: "warning",
    text: `This token is not 100% safe because admin has not revoked ownership. [Read more](${commonGithubUrl})`,
  };
};



const getSymbolWarning = (
  persistenceType?: persistenceType,
  adminRevokedOwnership?: boolean
):  JettonDetailMessage | undefined => {
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

const getTotalSupplyWarning = (
  persistenceType?: persistenceType,
  adminRevokedOwnership?: boolean
):  JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `The admin can mint more of this jetton without warning. [Read more](${commonGithubUrl})`,
    };
  }
};



export { getAdminMessage, getSymbolWarning, getTotalSupplyWarning };
