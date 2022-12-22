import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Address } from "ton";
import { isValidAddress } from "utils";

export const useJettonAddress = () => {
  const navigate = useNavigate();
  const { id }: { id?: string } = useParams();
  let isAddressValid = isValidAddress(id || "", "Invalid jetton address");

  let verifiedAddress = isAddressValid ? Address.parse(id!).toFriendly() : null;

  useEffect(() => {
    if (id && verifiedAddress && verifiedAddress !== id) {
      navigate(`/jetton/${verifiedAddress}`, { replace: true });
    }
  }, [id]);

  return {
    id: verifiedAddress,
    isAddressEmpty: !id,
  };
};
