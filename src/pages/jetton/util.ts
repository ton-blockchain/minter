import { JettonDetailMessage } from "./types";

const getAdminMessage = (isRevokedOwnership?: boolean, isAdmin?: boolean, jettonAddress?: string):  JettonDetailMessage | undefined => {
  if(!jettonAddress){
      return undefined
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


const getOffChainMessage = (isOnChain: boolean): JettonDetailMessage | undefined => {
 
  if (!isOnChain) {
    return {
      type: "warning",
      text: "This Jetton's metadata (name and symbol) can be altered or removed, since they're not stored on the TON chain",
    };
  }
  return 
};



export {  getAdminMessage, getOffChainMessage };
