import { atom, useRecoilState } from "recoil";
import { useAddressInput } from "hooks/useAddressInput";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { ROUTES } from "consts";
import { recoilPersist } from "recoil-persist";
import { Address } from "ton";
import { useCallback, useEffect, useMemo } from "react";
import { useJettonAddress } from "hooks/useJettonAddress";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { useNetwork } from "lib/hooks/useNetwork";
import { formatAddress } from "lib/network";
import { AddressHistory, normalizeAddressHistory } from "lib/address-history";

const { persistAtom } = recoilPersist({
  key: "addressHistory",
});

const addressHistoryState = atom<AddressHistory | string[]>({
  key: "addressHistory",
  default: { mainnet: [], testnet: [] },
  effects_UNSTABLE: [persistAtom],
});

export function useAddressHistory() {
  const [history, setHistory] = useRecoilState(addressHistoryState);
  const { setActive, setValue, addressInput } = useAddressInput();
  const navigate = useNavigatePreserveQuery();
  const { showNotification } = useNotification();
  const { jettonAddress } = useJettonAddress();
  const { network } = useNetwork();
  const addresses = useMemo(() => normalizeAddressHistory(history)[network], [history, network]);

  const addAddress = useCallback(
    (address: string) => {
      const raw = Address.parse(address).toString();
      setHistory((prev) => {
        const next = normalizeAddressHistory(prev);
        if (next[network][0] === raw && !Array.isArray(prev)) return prev;
        next[network] = [raw, ...next[network].filter((a) => a !== raw)].slice(0, 20);
        return next;
      });
    },
    [network, setHistory],
  );

  const resetAddresses = () => {
    setHistory((prev) => ({ ...normalizeAddressHistory(prev), [network]: [] }));
    setActive(false);
  };

  const removeAddress = (address: string) => {
    const raw = Address.parse(address).toString();
    setHistory((prev) => {
      const next = normalizeAddressHistory(prev);
      return { ...next, [network]: next[network].filter((a) => a !== raw) };
    });
  };

  const onAddressClick = (address: string) => {
    setActive(false);
    setValue("");

    addAddress(address);

    navigate(`${ROUTES.jetton}/${formatAddress(address, network)}`);
  };

  const onSubmit = (address: string) => {
    if (!address) return;

    if (!isValidAddress(address)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    const transformedAddress = formatAddress(Address.parse(address!), network);

    addAddress(transformedAddress);
    setValue("");
    setActive(false);

    navigate(`${ROUTES.jetton}/${transformedAddress}`);
  };

  useEffect(() => {
    jettonAddress && addAddress(jettonAddress);
  }, [addAddress, jettonAddress]);

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
