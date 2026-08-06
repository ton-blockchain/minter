import useJettonStore from "store/jetton-store/useJettonStore";
import { onchainFormSpec } from "pages/deployer/data";
import { Form } from "components/form";
import { JettonStoreState } from "store/jetton-store";
import { jettonDeployController } from "lib/deploy-controller";
import { Address } from "ton";
import useNotification from "hooks/useNotification";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useNetwork } from "lib/hooks/useNetwork";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "./jettonActions";

const inputsName = ["name", "symbol", "decimals", "tokenImage", "description"];

const getInputs = () => {
  return onchainFormSpec
    .filter((specInput) => {
      return inputsName.includes(specInput.name);
    })
    .map((specInput) => {
      return {
        ...specInput,
        disabled: specInput.name === "decimals" ? true : undefined,
      };
    });
};

const createDefaults = (state: JettonStoreState) => {
  const obj = {} as any;
  inputsName.forEach((key: string) => {
    if (key === "tokenImage") {
      obj[key] = state["rawJettonImage" as keyof JettonStoreState];
    } else {
      obj[key] = state[key as keyof JettonStoreState];
    }
  });
  return obj;
};

const inputs = getInputs();

interface UpdateMetadataProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateMetadata({ setOpen }: UpdateMetadataProps) {
  const store = useJettonStore();
  const { isAdmin, getJettonDetails, jettonMaster, metadataError } = store;
  const [actionInProgress, setActionInProgress] = useRecoilState(jettonActionsState);
  const { showNotification } = useNotification();
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const { network } = useNetwork();
  if (!isAdmin) {
    return null;
  }

  const onSubmit = async (values: any) => {
    setActionInProgress(true);
    try {
      if (!jettonMaster) {
        throw new Error("Jetton master address is unavailable");
      }
      if (metadataError || !store.decimals) {
        throw new Error("Token metadata is incomplete; reload it before editing");
      }

      const decimals = store.decimals;
      if (!/^\d+$/.test(decimals) || Number(decimals) > 255) {
        throw new Error("Jetton decimals must be an integer from 0 to 255");
      }

      const outcome = await jettonDeployController.updateMetadata(
        Address.parse(jettonMaster),
        {
          symbol: values.symbol,
          name: values.name,
          description: values.description,
          image: values.tokenImage,
          decimals,
        },
        tonConnectUI,
        walletAddress,
        network,
      );
      if (!(await getJettonDetails())) return;
      showNotification(
        outcome.status === "confirmed"
          ? "Metadata updated successfully"
          : "Metadata transaction was submitted, but final confirmation is still pending. Check the explorer before retrying.",
        outcome.status === "confirmed" ? "success" : "warning",
      );
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
      setOpen(false);
    }
  };

  const defaultValues = createDefaults(store);

  return (
    <Form
      submitText="Save"
      disableExample={true}
      onSubmit={onSubmit}
      inputs={inputs}
      isLoading={actionInProgress}
      defaultValues={defaultValues}
      onCancel={() => setOpen(false)}
    />
  );
}

export default UpdateMetadata;
