import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import Input from "components/Input";
import { formSpec } from "./data";
import { styled, Alert, Snackbar } from "@mui/material";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "components/BaseButton";
import HeroImg from "assets/hero.svg";
import { Box } from "@mui/system";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import JetonDetailsModal from "./JetonDetailsModal";
import useMediaQuery from "@mui/material/useMediaQuery";
import Description from "./Description";
import Screen from "components/Screen";

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


function DeployerScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });

  const { toggleConnectPopup } = useMainStore();
  const { address } = useConnectionStore();

  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<Address | null>(Address.parse('EQAkB7IMqZvzE070sYNKD0dWG4pN_WpfaDOr13Uw377AaA24'))
  // const [contractAddress, setContractAddress] = useState<Address | null>(null);
  const matches = useMediaQuery("(max-width:600px)");

  const onExampleClick = (name: string, value: string | number) => {
    setValue(name, value);
  };

  async function deployContract(data: any) {
    const connection = WalletConnection.getConnection();

    if (!address || !connection) {
      throw new Error("Wallet not connected");
    }
    const params = {
      owner: Address.parse(address),
      jettonName: data.name,
      jettonSymbol: data.symbol,
      amountToMint: toNano(data.mintAmount),
      imageUri: data.tokenImage,
      jettonDescription: data.description,
    };
    setIsLoading(true);
    const deployParams = createDeployParams(params);
    console.log(deployParams);
    const _contractAddress = new ContractDeployer().addressForContract(
      deployParams
    );

    const isDeployed = await WalletConnection.isContractDeployed(
      _contractAddress
    );

    if (isDeployed) {
      setError("Contract already deployed");
    }
    try {
      setContractAddress(null);
      const result = await jettonDeployController.createJetton(
        params,
        connection
      );
      setContractAddress(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onCloseJettonDetailsModal = () => {
    reset();
    setContractAddress(null);
  };

  return (
    <Screen id="deployer">
      <StyledTop>
        {!matches && <img alt="" src={HeroImg} />}
        <h1 style={{ fontSize: matches ? 20 : 40 }}>Jetton Deployer</h1>
      </StyledTop>
      <StyledForm onSubmit={handleSubmit(deployContract)}>
        <Description />

        {formSpec.map((spec, index) => {
          return (
            <Input
              required={spec.required}
              clearErrors={clearErrors}
              key={index}
              errorText="input required"
              error={errors[spec.name]}
              name={spec.name}
              control={control}
              label={spec.label}
              defaultValue={spec.default || ""}
              onExamleClick={onExampleClick}
              disabled={spec.disabled}
              // validate={spec.validate}
            />
          );
        })}
        {!address ? (
          <BaseButton onClick={() => toggleConnectPopup(true)}>
            Connect Wallet
          </BaseButton>
        ) : (
          <BaseButton loading={isLoading} type="submit">
            Deploy
          </BaseButton>
        )}
      </StyledForm>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      {contractAddress && address && (
        <JetonDetailsModal
          address={Address.parse(address)}
          contractAddress={contractAddress}
          onClose={onCloseJettonDetailsModal}
          open={true}
        />
      )}
    </Screen>
  );
}

export { DeployerScreen };
