import { useState } from "react";
import { Address, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Box, Fade, IconButton, Link, Typography } from "@mui/material";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { JETTON_DEPLOYER_CONTRACTS_GITHUB, ROUTES } from "consts";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";

import { StyledDescription, StyledTxLoaderContent } from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import analytics, { AnalyticsAction, AnalyticsCategory } from "services/analytics";
import { JettonDeployParams } from "lib/deploy-controller";
import { getUrlParam } from "utils";
import { offchainFormSpec, onchainFormSpec } from "./data";
import Form from "components/Form";
import { useTheme } from "@mui/material/styles";
import githubIcon from "assets/icons/github-logo.svg";
import rightArrow from "assets/icons/right.svg";
import { StyledGithubIcon } from "components/header/headerMenu/styled";

const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;

let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

function DeployerPage() {
  const { showNotification } = useNotification();
  const { address } = useConnectionStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

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
      <TxLoader open={isLoading}>
        <StyledTxLoaderContent>
          <Typography>Deploying...</Typography>
        </StyledTxLoaderContent>
      </TxLoader>
      <ScreenContent removeBackground>
        <Fade in>
          <Box>
            <Box mb={3} mt={0}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#161C28",
                  fontSize: 48,
                  [theme.breakpoints.down("md")]: {
                    fontSize: 30,
                    textAlign: "center",
                  },
                  [theme.breakpoints.down("sm")]: {
                    fontSize: 24,
                  },
                }}
                variant="h5">
                Mint your token
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 5,
                [theme.breakpoints.down("lg")]: {
                  flexDirection: "column",
                },
              }}>
              <Box
                sx={{
                  flex: 5,
                  background: "#FFFFFF",
                  border: "0.5px solid rgba(114, 138, 150, 0.24)",
                  boxShadow: "0px 2px 16px rgba(114, 138, 150, 0.08)",
                  borderRadius: "24px",
                  padding: 3,
                }}>
                <Typography
                  variant="h5"
                  mb={3}
                  sx={{
                    color: "#161C28",
                    fontSize: 20,
                    fontWeight: 800,
                  }}>
                  Create your own new Jetton
                </Typography>
                <Form submitText="Deploy" onSubmit={deployContract} inputs={formSpec} />
              </Box>
              <Box sx={{ flex: 4 }}>
                <Description />
              </Box>
            </Box>
          </Box>
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
    <StyledDescription sx={{ padding: 3 }}>
      <Typography
        variant="h5"
        mb={3}
        sx={{
          color: "#161C28",
          fontSize: 20,
          fontWeight: 800,
        }}>
        This is an open source tool
      </Typography>
      <Typography
        sx={{
          fontWeight: 600,
          color: "#728A96",
          "& a": {
            textDecoration: "none",
          },
        }}>
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
        . This free educational tool allows you to deploy your own Jetton to mainnet in one click.
        You will need at least 0.25 TON for deployment fees. <br />
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
        Is this deployer safe? Yes!{" "}
        <Link
          target="_blank"
          href="https://github.com/ton-defi-org/jetton-deployer-contracts#protect-yourself-and-your-users">
          Read
        </Link>{" "}
        this to understand.
      </Typography>
      <IconButton
        className="github-icon"
        sx={{ padding: 0, mt: 2 }}
        href={JETTON_DEPLOYER_CONTRACTS_GITHUB}
        target="_blank">
        <StyledGithubIcon src={githubIcon} />
        <Typography
          ml={0.75}
          variant="h5"
          sx={{
            color: "#000",
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
          }}>
          GitHub Repo{" "}
          <Box
            ml={1}
            sx={{
              display: "flex",
              alignItems: "center",
            }}>
            <img src={rightArrow} alt="Icon" />
          </Box>
        </Typography>
      </IconButton>
    </StyledDescription>
  );
}
