import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

const defaultState = {
  value: "",
  active: false,
};

const addressInputState = atom({
  key: "addressInput",
  default: defaultState,
});

export function useAddressInput() {
  const [addressInput, setAddressInput] = useRecoilState(addressInputState);

  const onClear = useCallback(() => {
    setAddressInput((prev) => ({ ...prev, value: "" }));
  }, []);

  const setValue = (val: string) => setAddressInput((prev) => ({ ...prev, value: val }));

  const setActive = (val: boolean) => setAddressInput((prev) => ({ ...prev, active: val }));

  return {
    onClear,
    setActive,
    setValue,
    addressInput,
  };
}
