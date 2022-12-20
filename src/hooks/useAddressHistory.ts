import { atom, useRecoilState } from "recoil";
import { useAddressInput } from "hooks/useAddressInput";
import { useNavigate } from "react-router-dom";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { ROUTES } from "consts";
import { useEffect } from "react";

const addressHistoryState = atom({
  key: "addressHistory",
  default: [] as string[],
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
    setAddresses((prev) => [...prev.filter((a) => a !== address)]);

  const onAddressClick = (address: string) => {
    setActive(false);
    setValue("");

    setAddresses((prev) => [address, ...prev.filter((a) => a !== address)]);

    navigate(`${ROUTES.jetton}/${address}`);
  };

  const onSubmit = () => {
    if (!addressInput.value) return;

    if (!isValidAddress(addressInput.value)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    setAddresses((prev) => [addressInput.value, ...prev.filter((a) => a !== addressInput.value)]);
    setValue("");
    setActive(false);

    navigate(`${ROUTES.jetton}/${addressInput.value}`);
  };

  useEffect(() => {
    setAddresses([...JSON.parse(window.localStorage.getItem("searchBarResults") || "[]")]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("searchBarResults", JSON.stringify(addresses));
  }, [addresses]);

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
