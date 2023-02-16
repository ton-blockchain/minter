import { atom, useRecoilState } from "recoil";
import { useAddressInput } from "hooks/useAddressInput";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { ROUTES } from "consts";
import { recoilPersist } from "recoil-persist";
import { Address } from "ton";
import { useEffect } from "react";
import { useJettonAddress } from "hooks/useJettonAddress";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";

const { persistAtom } = recoilPersist({
  key: "addressHistory",
});

const addressHistoryState = atom({
  key: "addressHistory",
  default: [] as string[],
  effects_UNSTABLE: [persistAtom],
});

export function useAddressHistory() {
  const [addresses, setAddresses] = useRecoilState(addressHistoryState);
  const { setActive, setValue, addressInput } = useAddressInput();
  const navigate = useNavigatePreserveQuery();
  const { showNotification } = useNotification();
  const { jettonAddress } = useJettonAddress();

  const addAddress = (address: string) =>
    setAddresses((prev: string[]) => [address, ...prev.filter((a) => a !== address)].slice(0, 20));

  const resetAddresses = () => {
    setAddresses([]);
    setActive(false);
  };

  const removeAddress = (address: string) =>
    setAddresses((prev: string[]) => [...prev.filter((a) => a !== address)]);

  const onAddressClick = (address: string) => {
    setActive(false);
    setValue("");

    addAddress(address);

    navigate(`${ROUTES.jetton}/${address}`);
  };

  const onSubmit = (address: string) => {
    if (!address) return;

    if (!isValidAddress(address)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    const transformedAddress = Address.parse(address!).toFriendly();

    addAddress(transformedAddress);
    setValue("");
    setActive(false);

    navigate(`${ROUTES.jetton}/${transformedAddress}`);
  };

  useEffect(() => {
    jettonAddress && addAddress(jettonAddress);
  }, []);

  return {
    addresses,
    addressInput,
    resetAddresses,
    removeAddress,
    onAddressClick,
    onSubmit,
    setActive,
    setValue,
  };
}
