import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Address } from "ton";
import { isValidAddress } from "utils";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";

export const useJettonAddress = () => {
  const navigate = useNavigatePreserveQuery();
  const { id }: { id?: string } = useParams();
  let isAddressValid = isValidAddress(id || "", "Invalid jetton address");

  let jettonAddress = isAddressValid ? Address.parse(id!).toFriendly() : null;

  useEffect(() => {
    if (id && jettonAddress && jettonAddress !== id) {
      navigate(`/jetton/${jettonAddress}`, { replace: true });
    }
  }, [id, jettonAddress, navigate]);

  return {
    jettonAddress,
    isAddressEmpty: !id,
  };
};
