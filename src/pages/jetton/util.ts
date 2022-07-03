import { persistenceType } from "lib/jetton-minter";
import { JettonDetailAction, JettonDetailMessage } from "./types";

const getAdminMessage = (
  isRevokedOwnership?: boolean,
  isAdmin?: boolean,
  jettonAddress?: string
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
      text: "You should revoke this token's ownership",
    };
  }

  return {
    type: "warning",
    text: "This token is not 100% safe because admin has not revoked ownership",
  };
};

const getOffChainMessage = (
  persistenceType?: persistenceType,
  adminRevokedOwnership?: boolean
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: "This can be changed by the admin without warning",
    };
  }

  switch (persistenceType) {
    case "offchain_ipfs":
      return {
        type: "warning",
        text: "This jetton’s metadata (name and symbol) is stored on IPFS instead of on-chain. It will not change, but be careful, it can disappear and become unpinned.",
      };
    case "offchain_private_domain":
      return {
        type: "warning",
        text: "Can be changed without warning by admin since metadata is stored on privately owned website",
      };

    default:
      return;
  }
};

const getFaultyMetadataWarning = (isAdminRevokedOwnership?: boolean) => {
  if (isAdminRevokedOwnership) {
    return "This token was created with a previous faulty version of the tool. The token is permanently unusable, please contact the admin to redeploy a new token";
  }
  return "This token was created with a previous faulty version of the tool. The token is now unusable but can be fixed, please contact the admin to fix it using this page";
};

const getBalanceActions = (
  toggleConnect: (val: boolean) => void,
  address?: string | null
): JettonDetailAction[] | undefined => {
  if (!address) {
    return [
      {
        action: () => toggleConnect(true),
        text: "Connect wallet",
      },
    ];
  }
  return;
};

export { getAdminMessage, getOffChainMessage, getFaultyMetadataWarning, getBalanceActions };
