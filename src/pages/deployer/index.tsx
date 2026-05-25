import { useState } from "react";
import { Address } from "ton";
import { Box, Fade, Link, Typography, styled, Button, Menu, MenuItem } from "@mui/material";
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
import { AppButton } from "components/appButton";
import { useNetwork } from "lib/hooks/useNetwork";
import { useCreatedTokens } from "hooks/useCreatedTokens";
import { CreatedTokensList } from "components/CreatedTokensList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DEFAULT_DECIMALS = 9;
const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;
let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

async function fetchDecimalsOffchain(url: string): Promise<{ decimals?: string }> {
  let res = await fetch(url);
  let obj = await res.json();
  return obj;
}

const CONTEXT = `You are a support assistant for TON Minter (minter.ton.org). Help users navigate the interface and solve problems.

WHERE TO FIND:
- Search bar is at the top of the page - enter a Jetton address to view token details
- "Mint your token" section is below the search bar - this is where you create new tokens
- Created tokens appear in "Your created tokens" list below the form (stored in your browser)
- Switch between Mainnet and Testnet using the button below "Need help?" section

HOW TO CREATE A TOKEN:
1. Connect wallet (button in top right corner)
2. Fill in Jetton Name, Symbol, Decimals, Tokens to Mint
3. Add Logo URL (256x256 PNG, transparent background)
4. Click "Deploy" button
5. Confirm transaction in your wallet
6. After success, you will be redirected to the token page

HOW TO FIND YOUR TOKEN:
- After creation, you are automatically redirected to your token page
- Your created tokens are saved in "Your created tokens" list under the form
- You can also search by address in the search bar
- If you lost the address, check your wallet transaction history

WHAT IF SOMETHING GOES WRONG:
- "Invalid address" - check the address format, make sure it's a TON address
- "Not enough balance" - you need at least 0.25 TON for deployment fees
- "Unable to query" or network errors - just try again, the network may be busy
- If the page loads forever - refresh the page
- If you can't find your token - check "Your created tokens" list or wallet history

TOKEN ACTIONS (on token page):
- Transfer: Enter recipient address and amount, click Transfer
- Mint: Create more tokens (only if you are the admin)
- Burn: Destroy tokens from your balance
- Revoke Ownership: Give up admin rights permanently (cannot be undone)

IMPORTANT:
- Created tokens list is stored only in your browser (localStorage)
- Testnet tokens have no real value, use them for testing
- Always revoke ownership after finalizing your token metadata

Answer the user's question based on this information. Be helpful and concise.`;

const AI_OPTIONS = [
  { name: "ChatGPT", url: "https://chatgpt.com/?hints=search&q=" },
  { name: "Claude", url: "https://claude.ai/new?q=" },
  { name: "Grok", url: "https://grok.com/?q=" },
  { name: "Perplexity", url: "https://www.perplexity.ai/?q=" },
];

const openAIChat = (baseUrl: string) => {
  window.open(`${baseUrl}${encodeURIComponent(CONTEXT)}`, "_blank");
};

const SearchLabel = styled(Typography)({
  color: "#728A96",
  opacity: 0.6,
  fontSize: 14,
  marginTop: 8,
  marginLeft: 18,
  "& span": { fontWeight: 800, cursor: "pointer", "&:hover": { color: "#1EAEFB" } },
});

function DeployerPage() {
  const { showNotification } = useNotification();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigatePreserveQuery();
  const [example, setExample] = useState<string | undefined>(undefined);
  const { addToken } = useCreatedTokens();

  async function deployContract(data: any) {
    if (!walletAddress || !tonConnectUI) throw new Error("Wallet not connected");

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
      addToken({
        address: Address.normalize(result),
        name: data.name,
        symbol: data.symbol,
        timestamp: Date.now(),
      });
      analytics.sendEvent(
        AnalyticsCategory.DEPLOYER_PAGE,
        AnalyticsAction.DEPLOY,
        contractAddress.toFriendly(),
      );
      navigate(`${ROUTES.jetton}/${Address.normalize(result)}`);
    } catch (err) {
      if (err instanceof Error) showNotification(<>{err.message}</>, "error");
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
              <Box sx={{ display: "flex", flexDirection: "column", flex: 4 }}>
                <CreatedTokensList />
                <Box sx={{ mt: 5 }}>
                  <Description />
                </Box>
              </Box>
            </FormWrapper>
          </Box>
        </Fade>
      </ScreenContent>
    </Screen>
  );
}

export { DeployerPage };

const Spacer = () => <span style={{ display: "block", height: 25 }} />;

function Description() {
  const { network } = useNetwork();
  const isTestnet = network === "testnet";
  const [aiAnchorEl, setAiAnchorEl] = useState<null | HTMLElement>(null);

  const switchNetwork = () => {
    window.location.href = isTestnet ? "/" : "/?testnet=true";
  };

  return (
    <StyledDescription sx={{ p: 3 }}>
      <Typography variant="h5" mb={3} sx={{ color: "#FFFFFF", fontSize: 20, fontWeight: 800 }}>
        This is an open source tool
      </Typography>
      <Typography
        sx={{
          fontWeight: 400,
          color: "#93A5B8",
          "& a": { textDecoration: "none", fontWeight: 500, color: "#1EAEFB" },
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
        Never deploy code that you've never seen before! This deployer is fully open source with all
        smart contract code{" "}
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
        .
        <Spacer />
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
          borderRadius: 5,
          border: "0.5px solid rgba(114, 138, 150, 0.16)",
        }}>
        <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16, mb: 1 }}>
          Need help?
        </Typography>
        <Typography sx={{ color: "#93A5B8", fontSize: 14, mb: 2 }}>
          If something isn't working, ask our AI assistant or reach out to{" "}
          <Link
            href="https://t.me/ton_minter"
            target="_blank"
            sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 600 }}>
            Support chat
          </Link>
          .
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            "& .MuiButton-root": { margin: "0 !important", flexShrink: 0 },
          }}>
          <AppButton
            onClick={() => window.open("https://t.me/ton_minter", "_blank")}
            height={36}
            transparent>
            Support Chat
          </AppButton>
          <Button
            onClick={(e) => setAiAnchorEl(e.currentTarget)}
            sx={{
              height: 36,
              borderRadius: 5,
              border: "1px solid #364459",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 600,
              px: 2,
              textTransform: "none",
              background: "rgba(29, 38, 51, 0.8)",
              "&:hover": { background: "rgba(37, 50, 68, 0.8)" },
            }}>
            AI <KeyboardArrowDownIcon sx={{ ml: 0.5, width: 16, height: 16 }} />
          </Button>
          <Menu
            anchorEl={aiAnchorEl}
            open={Boolean(aiAnchorEl)}
            onClose={() => setAiAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                background: "#1D2633",
                border: "0.5px solid #364459",
                borderRadius: 2,
                mt: 1,
                "& .MuiMenuItem-root": {
                  color: "#FFFFFF",
                  fontSize: 14,
                  "&:hover": { background: "#222C3D" },
                },
              },
            }}>
            {AI_OPTIONS.map((ai) => (
              <MenuItem
                key={ai.name}
                onClick={() => {
                  openAIChat(ai.url);
                  setAiAnchorEl(null);
                }}>
                {ai.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <AppButton transparent onClick={switchNetwork} height={36}>
          {isTestnet ? "Switch to Mainnet" : "Switch to Testnet"}
        </AppButton>
      </Box>
    </StyledDescription>
  );
}
