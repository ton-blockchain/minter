import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  JettonDeployState,
  JettonDeployController,
  EnvProfiles,
  Environments,
  ContractDeployer,
} from "jetton-deployer-contracts";

import { Address, TonClient, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import Input from "components/Input";
import { formSpec } from "./data";
import { styled } from "@mui/styles";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "components/BaseButton";
import HeroImg from "assets/hero.svg";
import { DeployProgressState } from "./types";
import DeployStatus from "./DeployStatus";
import { Box } from "@mui/system";

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "40px",
});

const StyledTop = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "70px",
  justifyContent: "center",
  marginBottom: "50px",
  " & img": {
    width: "400px",
  },
  "& h1": {
    fontSize: "40px",
  },
});

function Deployer() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });

  // const myFile: any = useRef(null);
  const { toggleConnectPopup } = useMainStore();
  const { session, address, adapterId } = useConnectionStore();
  const [deployProgress, setDeployProgress] = useState<DeployProgressState>(
    {} as DeployProgressState
  );
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [deployInProgress, setDeployInProgress] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const onProgress = async (
    depState: JettonDeployState,
    err?: Error,
    extra?: string
  ) => {
    setDeployProgress((oldState) => ({
      ...oldState,
      state: depState,
      contractAddress:
        depState === JettonDeployState.VERIFY_MINT
          ? extra
          : oldState.contractAddress,
    }));
  };

  async function onSubmit(data: any) {
    //@ts-ignore
    const client = new TonClient({
      endpoint: EnvProfiles[Environments.MAINNET].rpcApi,
    });
    const dep = new JettonDeployController(
      // @ts-ignore
      client
    );
    if (!address) {
      return;
    }

    setShowProgressModal(true);
    setDeployInProgress(true);
    setError(null);
    setDeployProgress({} as DeployProgressState);

    try {
      // await dep.createJetton(
      //   {
      //     owner: Address.parse(address),
      //     onProgress,
      //     jettonName: data.name,
      //     jettonSymbol: data.symbol,
      //     amountToMint: toNano(data.mintAmount),
      //   },
      //   new ContractDeployer(),
      //   adapterId,
      //   session,
      //   new WalletService()
      // );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setDeployInProgress(false);
    }
  }

  const connect = () => {
    toggleConnectPopup(true);
  };

  const onExampleClick = (name: string, value: string | number) => {
    setValue(name, value);
  };

  return (
    <div className="deployer">
      <DeployStatus
        deployInProgress={deployInProgress}
        open={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        deployProgress={deployProgress}
        error={error}
      />
      <StyledTop>
        <img alt='' src={HeroImg} />
        <h1>
          Smart-Contract <br /> Deployer
        </h1>
      </StyledTop>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {formSpec.map((spec, index) => {
          return (
            <Input
              clearErrors={clearErrors}
              required={true}
              key={index}
              errorText="input required"
              error={errors[spec.name]}
              name={spec.name}
              control={control}
              label={spec.label}
              defaultValue={spec.default}
              onExamleClick={onExampleClick}
            />
          );
        })}

        {address ? (
          <BaseButton type="submit">Deploy contract</BaseButton>
        ) : (
          <BaseButton onClick={connect}>connect wallet</BaseButton>
        )}
      </StyledForm>
    </div>
  );
}

export { Deployer };
