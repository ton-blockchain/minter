
const getAdminMessage = (isRevokedOwnership?: boolean, isAdmin?: boolean, jettonAddress?: string) => {
  if(!jettonAddress){
      return undefined
  }
  if (isRevokedOwnership) {
    return {
      type: "info",
      text: "Token is safe",
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
    text: "This token is not safe because admin has not revoked ownership",
  };
};




export {  getAdminMessage };
