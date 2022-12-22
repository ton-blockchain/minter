import { atom, useRecoilState } from "recoil";
import { useAddressInput } from "hooks/useAddressInput";
import { useNavigate } from "react-router-dom";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { ROUTES } from "consts";
import { recoilPersist } from "recoil-persist";
import { Address } from "ton";

const { persistAtom } = recoilPersist();

const addressHistoryState = atom({
  key: "addressHistory",
  default: [] as string[],
  effects_UNSTABLE: [persistAtom],
});

export function useAddressHistory() {
  const [addresses, setAddresses] = useRecoilState(addressHistoryState);
  const { setActive, setValue, addressInput } = useAddressInput();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const resetAddresses = () => {
    setAddresses([]);
    setActive(false);
  };

  const removeAddress = (address: string) =>
    setAddresses((prev: string[]) => [...prev.filter((a) => a !== address)]);

  const onAddressClick = (address: string) => {
    setActive(false);
    setValue("");

    setAddresses((prev: string[]) => [address, ...prev.filter((a) => a !== address)]);

    navigate(`${ROUTES.jetton}/${address}`);
  };

  const onSubmit = (address: string) => {
    if (!address) return;

    if (!isValidAddress(address)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    const transformedAddress = Address.parse(address!).toFriendly();

    setAddresses((prev: string[]) =>
      [transformedAddress, ...prev.filter((a) => a !== transformedAddress)].slice(0, 3),
    );
    setValue("");
    setActive(false);

    navigate(`${ROUTES.jetton}/${transformedAddress}`);
  };

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
