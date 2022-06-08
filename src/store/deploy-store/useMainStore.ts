import { useRecoilState } from "recoil";
import { deployStateAtom } from ".";

function useDeployStoreState() {
  const [deployState, setDeployState] = useRecoilState(deployStateAtom);

  const updateDeployStoreState = (name: string, value: any) => {
    setDeployState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return {
    ...deployState,
    updateDeployStoreState,
  };
}

export default useDeployStoreState;
