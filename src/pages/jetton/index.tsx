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
import SectionLabel from "components/SectionLabel";
import TransferAction from "./actions/TransferAction";
import { BN } from "bn.js";
import BigNumberDisplay from "components/BigNumberDisplay";
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
    selectedWalletAddress,
  } = useJettonStore();

  useEffect(() => {
    if (id && !isConnecting) {
      getJettonDetails();
    }
  }, [id, getJettonDetails, address, isConnecting]);

  return (
    <Screen>
      <FaultyDeploy />
      <Navbar customLink={{ text: "Create Jetton", path: ROUTES.deployer }} />

      <ScreenContent>
        <StyledContainer>
          <StyledRead>
            <SectionLabel>Shared Jetton metadata</SectionLabel>
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

            <StyledCategoryFields>
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
                hasButton={isAdmin && !adminRevokedOwnership}
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
                title="Total Supply"
                value={
                  totalSupply && (
                    <>
                      <BigNumberDisplay value={totalSupply} /> {symbol}
                    </>
                  )
                }
                dataLoading={jettonLoading}
                message={getTotalSupplyWarning(
                  persistenceType,
                  adminRevokedOwnership
                )}
                actions={totalSupplyActions}
              />
            </StyledCategoryFields>
          </StyledRead>

          <StyledWrite>
            <SectionLabel>Connected Jetton wallet</SectionLabel>
            <StyledCategoryFields>
              <Row
                title="Wallet Address"
                value={selectedWalletAddress}
                dataLoading={jettonLoading}
                address={selectedWalletAddress}
                description="Connected wallet public address, can be shared to receive jetton transfers"
              />
              <Row
                title="Wallet Balance"
                value={
                  balance && (
                    <>
                      <BigNumberDisplay value={balance} /> {symbol}
                    </>
                  )
                }
                dataLoading={jettonLoading}
                actions={balanceActions}
                description="Number of tokens in connected wallet that can be transferred to others"
              />
              <TransferAction />
            </StyledCategoryFields>
          </StyledWrite>
        </StyledContainer>
      </ScreenContent>
    </Screen>
  );
}

export { JettonPage };

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 30,
  width: "100%",
  [theme.breakpoints.down(1100)]: {
    flexDirection: "column",
  },
}));

export const StyledCategory = styled(Box)(({ theme }) => ({
  width: "calc(50% - 15px)",
  padding: "20px 30px 30px 30px",
  borderRadius: 16,
  [theme.breakpoints.down(1100)]: {
    width: "100%",
    padding: "20px 25px 20px 25px",
  },
}));

const StyledCategoryFields = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 24,
});

const StyledRead = styled(StyledCategory)({
  background: "rgba(80, 167, 234, 0.05)",
});

const StyledWrite = styled(StyledCategory)(({ theme }) => ({
  background: "#F7FAFC",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 140,
  },
}));

export const StyledTop = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 30,
});

export const StyledTopText = styled(Box)({
  color: "#27272E",
  display: "flex",
  flexDirection: "column",
  gap: 3,
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
