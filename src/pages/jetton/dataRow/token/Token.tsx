import React from "react";
import {
  StyledBlock,
  StyledCategoryFields,
  StyledTop,
  StyledTopImg,
  StyledTopText,
} from "pages/jetton/styled";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  adminActions,
  getAdminMessage,
  getFaultyMetadataWarning,
  getSymbolWarning,
  getTotalSupplyWarning,
  totalSupplyActions,
} from "pages/jetton/util";
import { DataRow } from "pages/jetton/dataRow/DataRow";
import BigNumberDisplay from "components/BigNumberDisplay";
import UpdateMetadata from "pages/jetton/actions/UpdateMetadata";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppHeading } from "components/appHeading";

export const Token = () => {
  const {
    jettonImage,
    adminAddress,
    isAdmin,
    adminRevokedOwnership,
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

  return (
    <StyledBlock>
      <StyledTop>
        <StyledTopImg>
          <LoadingImage src={jettonImage} alt="jetton image" loading={jettonLoading} />
        </StyledTopImg>
        <StyledTopText>
          <LoadingContainer loading={jettonLoading} loaderWidth="80px">
            {name && (
              <AppHeading text={name} variant="h2" fontWeight={800} fontSize={20} color="#161C28" />
            )}
          </LoadingContainer>
          <LoadingContainer loading={jettonLoading} loaderWidth="150px">
            {description && (
              <Box sx={{ maxWidth: 300 }}>
                <AppHeading
                  text={description}
                  variant="h5"
                  fontWeight={500}
                  fontSize={16}
                  color="#728A96"
                />
              </Box>
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
        <DataRow
          description="On-chain smart contract address of the Jetton parent (jetton-minter.fc)"
          title="Address"
          value={jettonMaster}
          dataLoading={jettonLoading}
          address={jettonMaster}
        />
        <DataRow
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
          showIcon={!isAdmin}
        />
        <DataRow
          title="Symbol"
          value={symbol}
          dataLoading={jettonLoading}
          message={getSymbolWarning(persistenceType, adminRevokedOwnership)}
        />
        <DataRow
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
  );
};
