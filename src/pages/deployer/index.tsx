import { useState } from "react";
import { Address } from "ton";
import { Box, Fade, Link, Typography, styled } from "@mui/material";
import { jettonDeployController, JettonDeployParams } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES, EXAMPLE_ADDRESS } from "consts";
import useNotification from "hooks/useNotification";
import { FormWrapper, ScreenHeading, StyledDescription, SubHeadingWrapper } from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import analytics, { AnalyticsAction, AnalyticsCategory } from "services/analytics";
import { getUrlParam, toDecimalsBN } from "utils";
import { offchainFormSpec, onchainFormSpec } from "./data";
import { Form } from "components/form";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { SearchBar } from "components/header/headerSearchBar";

const DEFAULT_DECIMALS = 9;

const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;

let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

async function fetchDecimalsOffchain(url: string): Promise<{ decimals?: string }> {
  let res = await fetch(url);
  let obj = await res.json();
  return obj;
}

const SearchBlock = styled(Box)(({ theme }) => ({
  background: "rgba(29, 38, 51, 0.8)",
  backdropFilter: "blur(0.5px)",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0 1px 1px 0 #2D3945 inset",
  borderRadius: 24,
  padding: 24,
  marginBottom: 32,
  overflow: "visible !important",
  position: "relative",
  zIndex: 9999,
}));

const SearchLabel = styled(Typography)({
  color: "#728A96", // ← как у FieldDescription
  opacity: 0.6, // ← как у FieldDescription
  fontSize: 14,
  marginTop: 8,
  marginLeft: 18,
  "& span": {
    fontWeight: 800,
    cursor: "pointer",
    "&:hover": {
      color: "#1EAEFB",
    },
  },
});

function DeployerPage() {
  const { showNotification } = useNotification();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigatePreserveQuery();
  const [example, setExample] = useState<string | undefined>(undefined);

  async function deployContract(data: any) {
    if (!walletAddress || !tonConnectUI) {
      throw new Error("Wallet not connected");
    }

    let decimals = data.decimals;
    if (data.offchainUri) {
      let res = await fetchDecimalsOffchain(
        data.offchainUri.replace("ipfs://", "https://ipfs.io/ipfs/"),
      );
      decimals = res.decimals;
    }

    const params: JettonDeployParams = {
      owner: Address.parse(walletAddress),
      onchainMetaData: {
        name: data.name,
        symbol: data.symbol,
        image: data.tokenImage,
        description: data.description,
        decimals: parseInt(decimals).toFixed(0),
      },
      offchainUri: data.offchainUri,
      amountToMint: toDecimalsBN(data.mintAmount, decimals ?? DEFAULT_DECIMALS),
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
      const result = await jettonDeployController.createJetton(params, tonConnectUI, walletAddress);
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
      <ScreenContent removeBackground>
        <Fade in>
          <Box>
            <Box mb={3} mt={3.75}>
              <ScreenHeading variant="h5">Mint your token</ScreenHeading>
            </Box>

            <Box
              sx={{
                background: "rgba(29, 38, 51, 0.8)",
                backdropFilter: "blur(0.5px)",
                border: "0.5px solid rgba(114, 138, 150, 0.24)",
                boxShadow: "0 1px 1px 0 #2D3945 inset",
                borderRadius: "24px",
                padding: "24px",
                marginBottom: "32px",
                overflow: "visible",
                position: "relative",
                zIndex: 1,
              }}>
              <SearchBar example={example} resetExample={() => setExample(undefined)} />
              <SearchLabel>
                Enter an existing Jetton contract address.
                <span onClick={() => setExample(EXAMPLE_ADDRESS)}> Use example.</span>
              </SearchLabel>
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

              <Description />
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
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          mb={3}
          sx={{
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: 800,
          }}>
          This is an open source tool
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            color: "#93A5B8",
            "& a": {
              textDecoration: "none",
              fontWeight: 500,
              color: "#1EAEFB",
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
          You will need at least 0.25 TON for deployment fees. <br />
          <Spacer />
          For detailed instructions and in-depth explanations of all fields please see the{" "}
          <Link
            target="_blank"
            href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices">
            GitHub README
          </Link>
          . It includes several best practice recommendations so please take a look.
          <Spacer />
          Never deploy code that you've never seen before! This deployer is fully open source with
          all smart contract code{" "}
          <Link target="_blank" href="https://github.com/ton-blockchain/minter-contract">
            available here
          </Link>
          . The HTML form is also{" "}
          <Link target="_blank" href="https://github.com/ton-blockchain/minter">
            open source
          </Link>{" "}
          and served from{" "}
          <Link target="_blank" href="https://github.com/ton-blockchain/minter">
            GitHub Pages
          </Link>
          . <Spacer />
          Is this deployer safe? Yes! Read{" "}
          <Link
            target="_blank"
            href="https://github.com/ton-blockchain/minter-contract#protect-yourself-and-your-users">
            this
          </Link>{" "}
          to understand why.
          <Spacer />
          Learn more about other token-minting solutions in our{" "}
          <Link target="_blank" href="https://blog.ton.org/history-of-mass-minting-on-ton">
            article
          </Link>
          .
        </Typography>
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            background: "rgba(19, 27, 37, 1)",
            borderRadius: 2,
            border: "0.5px solid rgba(114, 138, 150, 0.16)",
          }}>
          <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16, mb: 1 }}>
            Need help?
          </Typography>
          <Typography sx={{ color: "#93A5B8", fontSize: 14 }}>
            If something isn't working, reach out to our{" "}
            <Link
              href="https://t.me/ton_minter"
              target="_blank"
              sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 600 }}>
              Support chat
            </Link>{" "}
            or check the{" "}
            <Link
              href="https://docs.ton.org/"
              target="_blank"
              sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 600 }}>
              documentation
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </StyledDescription>
  );
}
