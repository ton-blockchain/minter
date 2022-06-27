import { useState } from "react";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Fade, Link, Typography } from "@mui/material";
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

import {
  StyledContainer,
  StyledDescription,
  StyledLeft,
  StyledTxLoaderContent,
} from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import Navbar from "components/navbar";
import SearchInput from "./SearchInput";
import Form from "./Form";
import SectionLabel from "components/SectionLabel";

function DeployerPage() {
  const { showNotification } = useNotification();
  const { address, adapterId } = useConnectionStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          <ReactRouterLink
            to={`${ROUTES.jetton}/${Address.normalize(contractAddress)}/`}
          >
            View contract
          </ReactRouterLink>
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


  return (
    <Screen>
      <Navbar />
      <TxLoader open={isLoading}>
        <StyledTxLoaderContent>
          <Typography>Deploying...</Typography>
        </StyledTxLoaderContent>
      </TxLoader>
      <ScreenContent removeBackground>
        <Fade in>
          <StyledContainer>
            <StyledLeft>
              <SearchInput />
              <Description />
            </StyledLeft>
            <Form onSubmit={deployContract} />
          </StyledContainer>
        </Fade>
      </ScreenContent>
    </Screen>
  );
}

export { DeployerPage };

const Spacer = () => {
  return <aside style ={{height: 25}}></aside>
}

function Description() {
  return (
    <StyledDescription>
      <SectionLabel>
        https://github.com/ton-defi-org/jetton-deployer-contracts
      </SectionLabel>
      <Typography>
        Jetton is the fungible{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-blockchain/TIPs/issues/74"
        >
          token standard
        </Link>{" "}
        for{" "}
        <Link target="_blank" href="https://ton.org">
          TON blockchain
        </Link>
        . This educational tool allows you to deploy your own Jetton to mainnet
        in one click. You will need at least 0.25 TON for deployment fees.{" "}
        <br />
        <Spacer />
        For detailed instructions and in-depth explanations of all fields please
        see the{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts#jetton-metadata-field-best-practices"
        >
          GitHub README
        </Link>
        . It includes several best practice recommendations so please take a
        look.
        <Spacer />
        Never deploy code that you've never seen before! This deployer is fully
        open source with all smart contract code{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts"
        >
          available here
        </Link>
        . The HTML form is also{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-webclient"
        >
          open source
        </Link>{" "}
        and served from{" "}
        <Link
          target="_blank"
          href="https://ton-defi-org.github.io/jetton-deployer-webclient"
        >
          GitHub Pages
        </Link>
        .  <Spacer />
        Is this deployer safe? Yes! read{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users"
        >
          this
        </Link>{" "}
        to understand why.
      </Typography>
    </StyledDescription>
  );
}
