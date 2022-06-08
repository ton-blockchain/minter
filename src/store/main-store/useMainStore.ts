import { useRecoilState } from "recoil";
import { mainStateAtom } from ".";

function useMainStore() {
  const [mainState, setMainState] = useRecoilState(mainStateAtom);

  const toggleConnectPopup = (value: boolean) => {
    setMainState((prevState) => ({
      ...prevState,
      showConnectModal: value,
    }));
  };

  return {
    ...mainState,
    toggleConnectPopup,
  };
}

export default useMainStore;
