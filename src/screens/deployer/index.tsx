import { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import Input from "components/Input";
import { formSpec } from "./data";
import { styled } from "@mui/material";
import useMainStore from "store/main-store/useMainStore";
import BaseButton from "components/BaseButton";
import HeroImg from "assets/hero.svg";
import { Box } from "@mui/system";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import { Alert, Snackbar, Typography, Link } from "@mui/material";
import JetonDetailsModal from "./JetonDetailsModal";
import useMediaQuery from '@mui/material/useMediaQuery';

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

const StyledWarning = styled(Box)({
  textAlign: "center",
  "& p": {
    fontSize: "20px",
    fontWeight: 500,
  },
});

function Deployer() {
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
  // const [contractAddress, setContractAddress] = useState<Address | null>(Address.parse('EQAkB7IMqZvzE070sYNKD0dWG4pN_WpfaDOr13Uw377AaA24'))
  const [contractAddress, setContractAddress] = useState<Address | null>(null);
  const matches = useMediaQuery('(max-width:600px)');

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
    };
    setIsLoading(true);
    const deployParams = createDeployParams(params);
    const _contractAddress = new ContractDeployer().addressForContract(
      deployParams
    );

    const isDeployed = await WalletConnection.isContractDeployed(
      _contractAddress
    );
      

    if (isDeployed) {
      setError('Contract already deployed')
      setIsLoading(false);
      return;
    }
    try {
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
    <div className="deployer">
      <StyledTop>
       {!matches &&  <img alt="" src={HeroImg} />}
        <h1 style={{fontSize:matches ? 20 : 40 }}>Jetton Deployer</h1>
      </StyledTop>
      <StyledForm onSubmit={handleSubmit(deployContract)}>

      <Typography variant="body2" gutterBottom>
        Jetton is the fungible <Link href="https://github.com/ton-blockchain/TIPs/issues/74">token standard</Link> for <Link href="https://ton.org">TON blockchain</Link>. This educational tool allows you to deploy your own Jetton to mainnet in one click. You will need at least 0.25 TON for deployment fees.
        Never deploy code that you've never seen before! This deployer is fully open source with all smart contract code <Link href="https://github.com/ton-defi-org/jetton-deployer-contracts">available here</Link>. The HTML form is also <Link href="https://github.com/ton-defi-org/jetton-deployer-webclient">open source</Link> and served from <Link href="https://ton-defi-org.github.io/jetton-deployer-webclient">GitHub Pages</Link>.
      </Typography>

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
            Deloy
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
    </div>
  );
}

export { Deployer };
