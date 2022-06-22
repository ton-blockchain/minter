import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { formSpec } from "./data";
import { styled, Typography } from "@mui/material";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "components/BaseButton";
import HeroImg from "assets/hero.png";
import { Box } from "@mui/system";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import Description from "./Description";
import Screen from "components/Screen";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import TxLoader from "components/TxLoader";
import { isMobile } from "react-device-detect";
import { Providers } from "lib/env-profiles";
import useNotification from "hooks/useNotification";
import Input from './Input'

const StyledForm = styled("form")({
  padding: "40px 50px 35px 70px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const StyledFormInputs = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const StyledTxLoaderContent = styled(Box)({
  textAlign: "center",
  "& p": {
    fontSize: 18,
    fontWeight: 500,
  },
});

const StyledFormHeader = styled(Box)({
  textAlign: "center",
  color: "#27272E",
  marginBottom: 35,
  "& h3": {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 12,
  },
});

const StyledLeftImg = styled("img")({
  width: "85%",
  transform: "scale(1.2)",
  transformOrigin: "top",
});

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "stretch",
  padding: "5px 0px 5px 5px",
});
const StyledActionBtn = styled(Box)({
  marginTop: 40,
  height: 46,
  maxWidth: 344,
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
});

const StyledLeft = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  background: "#F0F0F0",
  borderRadius: 16,

  width: 496,
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
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });
  const { showNotification } = useNotification();
  const { toggleConnectPopup } = useMainStore();
  const { address, adapterId } = useConnectionStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
    const contractAddress = new ContractDeployer().addressForContract(
      deployParams
    );

    const isDeployed = await WalletConnection.isContractDeployed(
      contractAddress
    );

    if (isDeployed) {
      showNotification(
        <>
          Contract already deployed,{" "}
          <Link to={`${ROUTES.jetton}/${contractAddress}/`}>View contract</Link>
        </>,
        "warning"
      );
      setIsLoading(false);
      return;
    }
    try {
      const result = await jettonDeployController.createJetton(
        params,
        connection
      );
      navigate(`${ROUTES.jetton}/${Address.normalize(result)}`);
    } catch (err) {
      if (err instanceof Error) {
        showNotification(<>{err.message}</>, "warning");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const showReminderInLoader = !isMobile && adapterId === Providers.TON_HUB;

 const onFormError = (value: any) => {
  const firstError = value[Object.keys(value)[0]]
  if(!firstError){
    return 
  }    
  showNotification(
    <>
     {firstError.message}
    </>,
    "warning"
  );
  
 }

  return (
    <Screen>
      <TxLoader open={isLoading}>
        <StyledTxLoaderContent>
          <Typography>Deploying...</Typography>
          {showReminderInLoader && (
            <Typography>
              Please check tonhub wallet for pending notification
            </Typography>
          )}
        </StyledTxLoaderContent>
      </TxLoader>
      <StyledContainer>
        <StyledLeft>
          {/* <StyledLeftImg alt="hero" src={HeroImg} /> */}
          <Description />
        </StyledLeft>
        <StyledForm onSubmit={handleSubmit(deployContract, onFormError)} >
        


          <StyledFormInputs>
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
                  errorMessage={spec.errorMessage}
                  // validate={spec.validate}
                />
              );
            })}
          </StyledFormInputs>

          <StyledActionBtn>
            {!address ? (
              <BaseButton fullWidth onClick={() => toggleConnectPopup(true)}>
                Connect Wallet
              </BaseButton>
            ) : (
              <BaseButton fullWidth type="submit">
                Deploy
              </BaseButton>
            )}
          </StyledActionBtn>
        </StyledForm>
      </StyledContainer>
    </Screen>
  );
}

export { DeployerScreen };
