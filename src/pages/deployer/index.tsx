import { useState } from "react";
import { Address } from "ton";
import { Box, Fade, Link, Typography } from "@mui/material";
import {
  jettonDeployController,
  JettonAlreadyDeployedError,
  JettonDeployParams,
} from "lib/deploy-controller";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import {
  JETTON_V2_CONTRACTS_GITHUB_URL,
  MINTER_METADATA_BEST_PRACTICES_URL,
  MINTER_GITHUB_URL,
  ROUTES,
} from "consts";
import useNotification from "hooks/useNotification";
import { FormWrapper, ScreenHeading, StyledDescription, SubHeadingWrapper } from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import analytics, { AnalyticsAction, AnalyticsCategory } from "services/analytics";
import { getUrlParam, toDecimalsBN } from "utils";
import { offchainFormSpec, onchainFormSpec } from "./data";
import { Form } from "components/form";
import { GithubButton } from "pages/deployer/githubButton";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useNetwork } from "lib/hooks/useNetwork";
import { formatAddress, NETWORK_CONFIG } from "lib/network";
import { fetchJettonMetadata } from "lib/jetton-minter";

const DEFAULT_DECIMALS = 9;

const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;

let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

function normalizeDecimals(value: unknown): string {
  const normalized = value === undefined || value === null || value === "" ? "9" : String(value);
  if (!/^\d+$/.test(normalized)) throw new Error("Jetton decimals must be an integer");
  const decimals = Number(normalized);
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error("Jetton decimals must be between 0 and 255");
  }
  return normalized;
}

function DeployerPage() {
  const { showNotification } = useNotification();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigatePreserveQuery();
  const { network } = useNetwork();

  const showPendingDeploy = (address: string) => {
    showNotification(
      <>
        Deployment was submitted, but final confirmation is still pending. Do not retry it. Check
        the deterministic contract address in the{" "}
        <Link href={`${NETWORK_CONFIG[network].explorer}/address/${address}`} target="_blank">
          explorer
        </Link>
        .
      </>,
      "warning",
      undefined,
      15000,
    );
  };

  async function deployContract(data: any) {
    let address: string | undefined;
    setIsLoading(true);
    try {
      if (!walletAddress || !tonConnectUI) {
        throw new Error("Wallet not connected");
      }
      let decimals = data.decimals;
      if (data.offchainUri) {
        const { metadata } = await fetchJettonMetadata(data.offchainUri);
        decimals = metadata.decimals;
      }
      const normalizedDecimals = normalizeDecimals(decimals ?? DEFAULT_DECIMALS);
      const params: JettonDeployParams = {
        owner: Address.parse(walletAddress),
        onchainMetaData: {
          name: data.name,
          symbol: data.symbol,
          image: data.tokenImage,
          description: data.description,
          decimals: normalizedDecimals,
        },
        offchainUri: data.offchainUri,
        amountToMint: toDecimalsBN(data.mintAmount, normalizedDecimals),
      };
      const deployParams = createDeployParams(params, data.offchainUri);
      const contractAddress = new ContractDeployer().addressForContract(deployParams);
      address = formatAddress(contractAddress, network);
      const result = await jettonDeployController.createJetton(params, tonConnectUI, network);
      if (result.status === "submitted") {
        showPendingDeploy(address);
        return;
      }

      analytics.sendEvent(AnalyticsCategory.DEPLOYER_PAGE, AnalyticsAction.DEPLOY, address);
      navigate(`${ROUTES.jetton}/${address}`);
    } catch (err) {
      if (err instanceof JettonAlreadyDeployedError) {
        address = formatAddress(err.address, network);
        showNotification(
          <>
            This jetton already exists. Open the{" "}
            <Link href={`${ROUTES.jetton}/${address}${window.location.search}`}>
              existing contract
            </Link>{" "}
            instead of deploying or minting it again.
          </>,
          "warning",
          undefined,
          10000,
        );
      } else {
        showNotification(err instanceof Error ? err.message : "", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenContent removeBackground>
        <Fade in>
          <Box>
            <Box mb={3} mt={3.75}>
              <ScreenHeading variant="h5">Mint your token</ScreenHeading>
            </Box>
            <FormWrapper>
              <SubHeadingWrapper>
                <Form
                  isLoading={isLoading}
                  submitText="Deploy"
                  onSubmit={deployContract}
                  inputs={formSpec}
                />
              </SubHeadingWrapper>
              <Box sx={{ flex: 4 }}>
                <Description />
              </Box>
            </FormWrapper>
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
          fontWeight: 400,
          color: "#728A96",
          "& a": {
            textDecoration: "none",
            fontWeight: 500,
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
          TON Blockchain
        </Link>
        . This free educational tool allows you to deploy your own Jetton to mainnet in one click.
        The deployment transaction sends 0.15 GRAM. Keep at least 0.20 GRAM in your wallet to cover
        fees. <br />
        <Spacer />
        For detailed instructions and in-depth explanations of all fields please see the{" "}
        <Link target="_blank" href={MINTER_METADATA_BEST_PRACTICES_URL}>
          GitHub README
        </Link>
        . It includes several best practice recommendations so please take a look.
        <Spacer />
        Never deploy code that you've never seen before! This deployer is fully open source with all
        smart contract code{" "}
        <Link target="_blank" href={JETTON_V2_CONTRACTS_GITHUB_URL}>
          available here
        </Link>
        . The HTML form is also{" "}
        <Link target="_blank" href={MINTER_GITHUB_URL}>
          open source
        </Link>{" "}
        and served from{" "}
        <Link target="_blank" href={MINTER_GITHUB_URL}>
          GitHub Pages
        </Link>
        . <Spacer />
        Learn more about other token-minting solutions in our{" "}
        <Link target="_blank" href="https://blog.ton.org/history-of-mass-minting-on-ton">
          article
        </Link>
        .
      </Typography>
      <GithubButton />
    </StyledDescription>
  );
}
