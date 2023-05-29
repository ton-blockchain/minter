import useJettonStore from "store/jetton-store/useJettonStore";
import { onchainFormSpec } from "pages/deployer/data";
import { Form } from "components/form";
import { JettonStoreState } from "store/jetton-store";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { Address } from "ton";
import useNotification from "hooks/useNotification";
import { useSetRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";

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
      obj[key] = state["jettonImage" as keyof JettonStoreState];
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
  const { isAdmin, getJettonDetails, jettonMaster } = store;
  const [actionInProgress, setActionInProgress] = useState(false);
  const { showNotification } = useNotification();
  const [tonconnect] = useTonConnectUI();
  const walltAddress = useTonAddress();
  if (!isAdmin) {
    return null;
  }

  const onSubmit = async (values: any) => {
    setActionInProgress(true);
    try {
      if (!jettonMaster) {
        throw new Error("");
      }

      await jettonDeployController.updateMetadata(
        Address.parse(jettonMaster),
        {
          symbol: values.symbol,
          name: values.name,
          description: values.description,
          image: values.tokenImage,
          decimals: parseInt(values.decimals).toFixed(0),
        },
        tonconnect,
        walltAddress,
      );
      await getJettonDetails();
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
