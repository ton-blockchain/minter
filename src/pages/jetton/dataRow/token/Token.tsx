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
import { Box, Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  adminActions,
  getAdminMessage,
  getFaultyMetadataWarning,
  getMetadataWarning,
  getTotalSupplyWarning,
  totalSupplyActions,
} from "pages/jetton/util";
import { DataRow } from "pages/jetton/dataRow/DataRow";
import BigNumberDisplay from "components/BigNumberDisplay";
import UpdateMetadata from "pages/jetton/actions/UpdateMetadata";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppHeading } from "components/appHeading";
import brokenImage from "assets/icons/question.png";

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
    decimals,
    isImageBroken,
  } = useJettonStore();

  return (
    <StyledBlock sx={{ width: "calc(55% - 15px)" }}>
      <StyledTop>
        <StyledTopImg>
          <LoadingImage
            src={!isImageBroken ? jettonImage : brokenImage}
            alt="jetton image"
            loading={jettonLoading}
          />
        </StyledTopImg>
        <StyledTopText>
          <LoadingContainer loading={jettonLoading} loaderWidth="80px">
            {name && (
              <AppHeading text={name} variant="h2" fontWeight={800} fontSize={20} color="#161C28" />
            )}
          </LoadingContainer>
          <LoadingContainer loading={jettonLoading} loaderWidth="150px">
            <Tooltip arrow title={description && description?.length > 80 ? description : ""}>
              <Box sx={{ maxWidth: 300, maxHeight: 60 }}>
                <AppHeading
                  text={description || "Description"}
                  limitText={80}
                  variant="h4"
                  fontWeight={500}
                  fontSize={16}
                  color="#728A96"
                />
              </Box>
            </Tooltip>
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
          message={getMetadataWarning(persistenceType, adminRevokedOwnership)}
        />
        <DataRow
          title="Decimals"
          value={decimals}
          dataLoading={jettonLoading}
          message={getMetadataWarning(persistenceType, adminRevokedOwnership)}
        />
        <DataRow
          title="Total Supply"
          value={
            totalSupply && (
              <>
                <BigNumberDisplay value={totalSupply.toString()} decimals={parseInt(decimals!)} />{" "}
                {symbol}
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
