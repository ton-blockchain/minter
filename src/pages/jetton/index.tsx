import { Box, styled, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  adminActions,
  balanceActions,
  getAdminMessage,
  getFaultyMetadataWarning,
  getSymbolWarning,
  getTotalSupplyWarning,
  totalSupplyActions,
} from "./util";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useParams } from "react-router-dom";
import { ScreenContent, Screen } from "components/Screen";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import useJettonStore from "store/jetton-store/useJettonStore";
import Navbar from "components/navbar";
import { ROUTES } from "consts";
import Alert from "@mui/material/Alert";
import FaultyDeploy from "./FaultyDeploy";
import Row from "./Row";
function JettonPage() {
  const { id }: { id?: string } = useParams();

  const { address, isConnecting } = useConnectionStore();

  const {
    getJettonDetails,
    jettonImage,
    adminAddress,
    isAdmin,
    adminRevokedOwnership,
    balance,
    symbol,
    name,
    description,
    jettonMaster,
    persistenceType,
    totalSupply,
    jettonAddress,
    isJettonDeployerFaultyOnChainData,
    jettonLoading,
  } = useJettonStore();

  useEffect(() => {
    if (id && !isConnecting) {
      getJettonDetails();
    }
  }, [id, getJettonDetails, address, isConnecting]);

  return (
    <Screen>
      <Navbar customLink={{ text: "Create Jetton", path: ROUTES.deployer }} />

      <FaultyDeploy />
      <ScreenContent>
        <Box style={{ background: "#F7FAFC" }}>
          <StyledContainer>
            <StyledTop>
              <StyledTopImg>
                <LoadingImage
                  src={jettonImage}
                  alt="jetton image"
                  loading={jettonLoading}
                />
              </StyledTopImg>
              <StyledTopText>
                <LoadingContainer loading={jettonLoading} loaderWidth="80px">
                  <Typography variant="h3">{name}</Typography>
                </LoadingContainer>
                <LoadingContainer loading={jettonLoading} loaderWidth="150px">
                  {description && (
                    <Typography variant="h5">{description}</Typography>
                  )}
                </LoadingContainer>
              </StyledTopText>
            </StyledTop>
            {!isAdmin && isJettonDeployerFaultyOnChainData && (
              <Alert variant="filled" severity="error">
                {getFaultyMetadataWarning(adminRevokedOwnership)}
              </Alert>
            )}

            <StyledTextSections>
              <Row
                description="On-chain smart contract address of the Jetton parent (jetton-minter.fc)"
                title="Address"
                value={jettonMaster}
                dataLoading={jettonLoading}
                address={jettonMaster}
              />
              <Row
                title="Admin"
                value={adminRevokedOwnership ? "Empty address" : adminAddress}
                address={adminAddress}
                description="Account address that can mint tokens freely and change metadata"
                message={getAdminMessage(
                  jettonAddress,
                  symbol,
                  adminRevokedOwnership,
                  isAdmin,
                  jettonMaster
                )}
                dataLoading={jettonLoading}
                actions={adminActions}
                hasButton = {isAdmin && !adminRevokedOwnership}
              />
              <Row
                title="Symbol"
                value={symbol}
                dataLoading={jettonLoading}
                message={getSymbolWarning(
                  persistenceType,
                  adminRevokedOwnership
                )}
              />
              <Row
                title="Total supply"
                value={
                  totalSupply && `${totalSupply.toLocaleString()} ${symbol}`
                }
                dataLoading={jettonLoading}
                message={getTotalSupplyWarning(
                  persistenceType,
                  adminRevokedOwnership
                )}
                actions={totalSupplyActions}
              />
              <StyledCategoryTitle>Connected Jetton Wallet</StyledCategoryTitle>
              <Row
                title="Owner"
                value={address}
                dataLoading={jettonLoading}
                address={address}
                description="Owner wallet contract, used for jettons transfers"
              />
              <Row
                title="Jetton Wallet"
                value={jettonAddress}
                dataLoading={jettonLoading}
                address={jettonAddress}
                description={
                  symbol &&
                  `On-chain smart contract address of the Jetton wallet (jetton-wallet.fc), holds the ${symbol} balance`
                }
              />
              <Row
                title="Balance"
                value={balance && `${balance.toLocaleString()} ${symbol}`}
                dataLoading={jettonLoading}
                actions={balanceActions}
              />
            </StyledTextSections>
          </StyledContainer>
        </Box>
      </ScreenContent>
    </Screen>
  );
}

export { JettonPage };

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 30,
  flexDirection: "column",
  width: "100%",
  maxWidth: 600,
  marginLeft: "auto",
  marginRight: "auto",
  padding: "60px 0px",
  [theme.breakpoints.down("sm")]: {
    padding: "30px 20px",
  },
}));

export const StyledTop = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 30,
});

export const StyledTopText = styled(Box)({
  color: "#27272E",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  flex: 1,
  "& h5": {
    fontSize: 15,
    fontWeight: 400,
  },
  "& h3": {
    fontSize: 19,
    fontWeight: 600,
  },
});

const StyledTopImg = styled(Box)(({ theme }) => ({
  width: 90,
  height: 90,
  borderRadius: "50%",
  overflow: "hidden",
  background: "rgba(0,0,0, 0.1)",
  border: "13px solid #D9D9D9",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    border: "2px solid #D9D9D9",
  },
}));

const StyledTextSections = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 24,
});

const StyledCategoryTitle = styled(Typography)({
  fontWeight: 500,
  fontSize: 18,
  marginTop: 20,
});
