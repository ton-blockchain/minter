import React, { useState } from "react";
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
import { AppButton } from "components/appButton";
import pen from "assets/icons/pen.svg";
import { CenteringWrapper } from "components/footer/styled";

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
    jettonWalletAddress,
    isJettonDeployerFaultyOnChainData,
    jettonLoading,
    decimals,
    isImageBroken,
  } = useJettonStore();
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <StyledBlock sx={{ width: "calc(55% - 15px)" }}>
      {!openEdit ? (
        <>
          <StyledTop>
            <StyledTopImg>
              <LoadingImage
                src={!isImageBroken ? jettonImage : brokenImage}
                alt="jetton image"
                loading={jettonLoading}
              />
            </StyledTopImg>
            <StyledTopText marginLeft="4px" marginTop="3px">
              <LoadingContainer loading={jettonLoading} loaderWidth="80px">
                {name && (
                  <AppHeading
                    text={`${name} ${symbol && `(${symbol})`}`}
                    variant="h2"
                    fontWeight={800}
                    fontSize={20}
                    color="#161C28"
                  />
                )}
              </LoadingContainer>
              <LoadingContainer loading={jettonLoading} loaderWidth="150px">
                <Tooltip arrow title={description && description?.length > 80 ? description : ""}>
                  <Box marginTop=".5px" sx={{ maxWidth: 300, maxHeight: 60 }}>
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
            {isAdmin && !adminRevokedOwnership && !jettonLoading && (
              <Box sx={{ alignSelf: "start" }}>
                <AppButton width={113} height={32} transparent onClick={() => setOpenEdit(true)}>
                  <CenteringWrapper>
                    <img
                      src={pen}
                      alt="Pen Icon"
                      width={15}
                      height={15}
                      style={{ marginRight: 4 }}
                    />
                    Edit token
                  </CenteringWrapper>
                </AppButton>
              </Box>
            )}
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
                jettonWalletAddress,
                symbol,
                adminRevokedOwnership,
                isAdmin,
                jettonMaster,
              )}
              dataLoading={jettonLoading}
              actions={adminActions}
              hasButton={isAdmin && !adminRevokedOwnership}
              showIcon={!isAdmin}
              regularAddress
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
                    <BigNumberDisplay
                      value={totalSupply.toString()}
                      decimals={parseInt(decimals!)}
                    />{" "}
                    {symbol}
                  </>
                )
              }
              dataLoading={jettonLoading}
              message={getTotalSupplyWarning(persistenceType, adminRevokedOwnership)}
              actions={totalSupplyActions}
            />
          </StyledCategoryFields>
        </>
      ) : (
        <UpdateMetadata setOpen={setOpenEdit} />
      )}
    </StyledBlock>
  );
};
