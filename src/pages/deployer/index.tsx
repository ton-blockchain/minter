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
import useNotification from "hooks/useNotification";

import {
  StyledContainer,
  StyledDescription,
  StyledLeft,
  StyledRight,
  StyledTxLoaderContent,
} from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import Navbar from "components/navbar";
import SearchInput from "./SearchInput";
import SectionLabel from "components/SectionLabel";
import analytics, { AnalyticsAction, AnalyticsCategory } from "services/analytics";
import { JettonDeployParams } from "../../lib/deploy-controller";
import { getUrlParam } from "utils";
import { offchainFormSpec, onchainFormSpec } from "./data";
import Form from "components/Form";

const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;

let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

function DeployerPage() {
  const { showNotification } = useNotification();
  const { address } = useConnectionStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function deployContract(data: any) {
    const connection = WalletConnection.getConnection();

    if (!address || !connection) {
      throw new Error("Wallet not connected");
    }
    const params: JettonDeployParams = {
      owner: Address.parse(address),
      onchainMetaData: {
        name: data.name,
        symbol: data.symbol,
        image: data.tokenImage,
        description: data.description,
      },
      offchainUri: data.offchainUri,
      amountToMint: toNano(data.mintAmount),
    };
    setIsLoading(true);
    const deployParams = createDeployParams(params, data.offchainUri);
    const contractAddress = new ContractDeployer().addressForContract(deployParams);

    const isDeployed = await WalletConnection.isContractDeployed(contractAddress);

    if (isDeployed) {
      showNotification(
        <>
          Contract already deployed,{" "}
          <ReactRouterLink to={`${ROUTES.jetton}/${Address.normalize(contractAddress)}/`}>
            View contract
          </ReactRouterLink>
        </>,
        "warning",
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await jettonDeployController.createJetton(params, connection);
      analytics.sendEvent(
        AnalyticsCategory.DEPLOYER_PAGE,
        AnalyticsAction.DEPLOY,
        contractAddress.toFriendly(),
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
            <StyledRight>
              <SectionLabel>Create your own new Jetton</SectionLabel>
              <Form submitText="Deploy" onSubmit={deployContract} inputs={formSpec} />
            </StyledRight>
          </StyledContainer>
        </Fade>
      </ScreenContent>
    </Screen>
  );
}

export { DeployerPage };

const Spacer = () => {
  return <aside style={{ height: 25 }}></aside>;
};

function Description() {
  return (
    <StyledDescription>
      <SectionLabel href="https://github.com/ton-defi-org/jetton-deployer-contracts">
        https://github.com/ton-defi-org/jetton-deployer-contracts
      </SectionLabel>
      <Typography>
        Jetton is the fungible{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md">
          token standard
        </Link>{" "}
        for{" "}
        <Link target="_blank" href="https://ton.org">
          TON blockchain
        </Link>
        .This tool uses the{" "}
        <Link href="https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md">
          discoverable jetton wallet
        </Link>{" "}
        protocol .This free educational tool allows you to deploy your own Jetton to mainnet in one
        click. You will need at least 0.25 TON for deployment fees. <br />
        <Spacer />
        For detailed instructions and in-depth explanations of all fields please see the{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts#jetton-metadata-field-best-practices">
          GitHub README
        </Link>
        . It includes several best practice recommendations so please take a look.
        <Spacer />
        Never deploy code that you've never seen before! This deployer is fully open source with all
        smart contract code{" "}
        <Link target="_blank" href="https://github.com/ton-defi-org/jetton-deployer-contracts">
          available here
        </Link>
        . The HTML form is also{" "}
        <Link target="_blank" href="https://github.com/ton-defi-org/jetton-deployer-webclient">
          open source
        </Link>{" "}
        and served from{" "}
        <Link target="_blank" href="https://ton-defi-org.github.io/jetton-deployer-webclient">
          GitHub Pages
        </Link>
        . <Spacer />
        Is this deployer safe? Yes! read{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users">
          this
        </Link>{" "}
        to understand why.
      </Typography>
    </StyledDescription>
  );
}
