import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { formSpec } from "./data";
import { Fade, Link, styled, Typography } from "@mui/material";
import BaseButton from "components/BaseButton";
import { Box } from "@mui/system";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import TxLoader from "components/TxLoader";
import { isMobile } from "react-device-detect";
import { Providers } from "lib/env-profiles";
import useNotification from "hooks/useNotification";
import Input from './Input'



function Deployer() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });
  const { showNotification } = useNotification();
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
          <ReactRouterLink to={`${ROUTES.jetton}/${Address.normalize(contractAddress)}/`}>View contract</ReactRouterLink>
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
        showNotification(<>{err.message}</>, "error");
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
    "warning",
    undefined,
    3000
  );
  
 }

  return (
    <>
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
      <Fade in>
      <StyledContainer>
        <StyledLeft>
          <Description />
        </StyledLeft>
        <StyledForm onSubmit={handleSubmit(deployContract, onFormError)} >
        
          <StyledFormInputs>
            {formSpec.map((spec, index) => {
              return (
                <Input
                  required={spec.required}
                  description={spec.description}
                  clearErrors={clearErrors}
                  key={index}
                  error={errors[spec.name]}
                  name={spec.name}
                  control={control}
                  label={spec.label}
                  defaultValue={spec.default || ""}
                  onExamleClick={onExampleClick}
                  disabled={spec.disabled}
                  errorMessage={spec.errorMessage}
                />
              );
            })}
          </StyledFormInputs>

          <StyledActionBtn>
          <BaseButton type="submit">
                Deploy
              </BaseButton>
          </StyledActionBtn>
        </StyledForm>
      </StyledContainer>
      </Fade>
    </>
  );
}

export { Deployer };


const StyledDescription = styled(Box)(({theme}) => ({
    padding: 47,
    position:'relative',
    height:'100%',
    "& p":{
        fontSize: 18,
        lineHeight: '32px'
    },
    [theme.breakpoints.down('md')]: {
        padding: 20,
        "& p":{
            fontSize: 14,
            lineHeight: '20px'
        },
       }
  }))
  
  function Description() {
    return (
      <StyledDescription>
      <Typography variant="body2" gutterBottom>
      Jetton is the fungible{" "}
      <Link href="https://github.com/ton-blockchain/TIPs/issues/74">
        token standard
      </Link>{" "}
      for <Link href="https://ton.org">TON blockchain</Link>. This
      educational tool allows you to deploy your own Jetton to mainnet in
      one click. You will need at least 0.25 TON for deployment fees. Never
      deploy code that you've never seen before! This deployer is fully open
      source with all smart contract code{" "}
      <Link href="https://github.com/ton-defi-org/jetton-deployer-contracts">
        available here
      </Link>
      . The HTML form is also{" "}
      <Link href="https://github.com/ton-defi-org/jetton-deployer-webclient">
        open source
      </Link>{" "}
      and served from{" "}
      <Link href="https://ton-defi-org.github.io/jetton-deployer-webclient">
        GitHub Pages
      </Link>
      . Is this deployer safe? Yes! read{" "}
      <Link href="https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users">
        this
      </Link>{" "}
      to understand why.
    </Typography>
    </StyledDescription>
    )
  }


  const StyledForm = styled("form")(({theme}) => ({
    padding: "40px 30px 35px 70px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down('lg')]: {
      padding: "40px 20px 35px 40px",
    },
    [theme.breakpoints.down('md')]: {
      padding: 0,
     }
    
  }));
  
  const StyledFormInputs = styled(Box)({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 17,
    
  });
  
  const StyledTxLoaderContent = styled(Box)({
    textAlign: "center",
    "& p": {
      fontSize: 18,
      fontWeight: 500,
    },
  });
  
  const StyledContainer = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "stretch",
    padding: "5px 0px 5px 5px",
    [theme.breakpoints.down('md')]: {
     flexDirection:'column',
     gap:30,
     padding: "15px 15px 30px 15px",
    }
  }));
  
  const StyledActionBtn = styled(Box)({
    marginTop: 40,
    height: 46,
    maxWidth: 344,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    "& .base-button":{
      width:'100%'
    }
  });
  
  const StyledLeft = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    background: "#F0F0F0",
    borderRadius: 16,
    width: 496,
    [theme.breakpoints.down('lg')]: {
      width: 396,
    },
    [theme.breakpoints.down('md')]: {
      width:'100%'
     }
  }));