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
import Alert from "@mui/material/Alert";
import FaultyDeploy from "./FaultyDeploy";
import Row from "./Row";
import SectionLabel from "components/SectionLabel";
import TransferAction from "./actions/TransferAction";
import BigNumberDisplay from "components/BigNumberDisplay";
import UpdateMetadata from "./actions/UpdateMetadata";
import {
  StyledBlock,
  StyledCategoryFields,
  StyledContainer,
  StyledTop,
  StyledTopImg,
  StyledTopText,
} from "pages/jetton/styled";

export const JettonPage = () => {
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
      <ScreenContent>
        <StyledContainer>
          <StyledBlock>
            <StyledTop>
              <StyledTopImg>
                <LoadingImage src={jettonImage} alt="jetton image" loading={jettonLoading} />
              </StyledTopImg>
              <StyledTopText>
                <LoadingContainer loading={jettonLoading} loaderWidth="80px">
                  <Typography variant="h3">{name}</Typography>
                </LoadingContainer>
                <LoadingContainer loading={jettonLoading} loaderWidth="150px">
                  {description && <Typography variant="h5">{description}</Typography>}
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
                  jettonMaster,
                )}
                dataLoading={jettonLoading}
                actions={adminActions}
                hasButton={isAdmin && !adminRevokedOwnership}
              />
              <Row
                title="Symbol"
                value={symbol}
                dataLoading={jettonLoading}
                message={getSymbolWarning(persistenceType, adminRevokedOwnership)}
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
                message={getTotalSupplyWarning(persistenceType, adminRevokedOwnership)}
                actions={totalSupplyActions}
              />
              <UpdateMetadata />
            </StyledCategoryFields>
          </StyledBlock>

          <StyledBlock>
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
          </StyledBlock>
        </StyledContainer>
      </ScreenContent>
    </Screen>
  );
};
