import { Box, Typography } from "@mui/material";
import { JettonDetailAction, JettonDetailMessage } from "./types";
import AddressLink from "components/AddressLink";
import { useEffect, useRef, useState } from "react";
import BaseButton from "components/BaseButton";
import {
  getAdminMessage,
  getBalanceActions,
  getFaultyMetadataWarning,
  getOffChainMessage,
} from "./util";
import useNotification from "hooks/useNotification";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useParams } from "react-router-dom";
import { ScreenContent, Screen } from "components/Screen";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import TxLoader from "components/TxLoader";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import useJettonStore from "store/jetton-store/useJettonStore";
import Navbar from "components/navbar";
import { ROUTES } from "consts";
import Alert from "@mui/material/Alert";

import {
  StyledContainer,
  StyledTop,
  StyledTopImg,
  StyledTopText,
  StyledTextSections,
  StyledCategoryTitle,
  StyledSection,
  StyledSectionTitle,
  StyledSectionRight,
  StyledSectionRightColored,
  StyledSectionValue,
  StyledMessage,
} from "./styles";
import FieldDescription from "components/FieldDescription";
import FaultyDeploy from "./FaultyDeploy";

function JettonPage() {
  const { id }: { id?: string } = useParams();

  const { address, isConnecting, toggleConnect } = useConnectionStore();
  const { showNotification } = useNotification();
  const getJettonOnLoadRef = useRef(false);
  const [txLoading, setTxLoading] = useState(false);
  const [jettonLoading, setJettonLoading] = useState(true);

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
    revokeAdminOwnership,
    jettonMaster,
    reset,
    persistenceType,
    totalSupply,
    jettonAddress,
    isJettonDeployerFaultyOnChainData,
  } = useJettonStore();

  const onRevokeAdminOwnership = async (contractAddr?: string) => {
    if (!contractAddr) {
      return;
    }
    try {
      setTxLoading(true);
      await revokeAdminOwnership(contractAddr);
      showNotification(<>Successfully revoked ownership </>, "success");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(<>{error.message}</>, "error");
      }
    } finally {
      setTxLoading(false);
    }
  };

  const onGetJetton = async (id: string, addr?: string | null) => {
    try {
      setJettonLoading(true);
      await getJettonDetails(id, addr);
    } catch (error) {
      if (error instanceof Error) {
        showNotification(<>{error.message}</>, "error");
      }
    } finally {
      setJettonLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setJettonLoading(false);
      return;
    }
    if (!getJettonOnLoadRef.current && !isConnecting) {
      onGetJetton(id, address);
      getJettonOnLoadRef.current = true;
    }
  }, [id, getJettonDetails, isConnecting]);

  useEffect(() => {
    if (jettonMaster) {
      onGetJetton(jettonMaster, address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, getJettonDetails]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <Screen>
      <Navbar customLink={{ text: "Create Jetton", path: ROUTES.deployer }} />

      <FaultyDeploy />

      <TxLoader open={txLoading}>
        <Typography>Revoking in progress</Typography>
      </TxLoader>

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
                  adminRevokedOwnership,
                  isAdmin,
                  jettonMaster
                )}
                dataLoading={jettonLoading}
                button={
                  isAdmin
                    ? {
                        text: "Revoke ownership",
                        action: () => onRevokeAdminOwnership(jettonMaster),
                      }
                    : undefined
                }
              />
              <Row
                title="Symbol"
                value={symbol}
                dataLoading={jettonLoading}
                message={getOffChainMessage(
                  persistenceType,
                  adminRevokedOwnership
                )}
              />
              <Row
                title="Total supply"
                value={totalSupply && `${totalSupply} ${symbol}`}
                dataLoading={jettonLoading}
                message={
                  !adminRevokedOwnership
                    ? {
                        text: "The admin can mint more of this jetton without warning",
                        type: "warning",
                      }
                    : undefined
                }
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
                value={
                  balance && `${parseFloat(balance).toLocaleString()} ${symbol}`
                }
                dataLoading={jettonLoading}
                actions={getBalanceActions(toggleConnect, address)}
              />
            </StyledTextSections>
          </StyledContainer>
        </Box>
      </ScreenContent>
    </Screen>
  );
}

interface RowProps {
  title: string;
  value?: string | null;
  message?: JettonDetailMessage | undefined;
  address?: string | null;
  actions?: JettonDetailAction[] | undefined;
  dataLoading: boolean;
  description?: string;
}

const Row = ({
  title,
  value,
  message,
  actions,
  dataLoading,
  description,
  address,
}: RowProps) => {
  return (
    <Box>
      <StyledSection>
        <StyledSectionTitle>
          <Typography>{title}</Typography>
        </StyledSectionTitle>
        <StyledSectionRight>
          <StyledSectionRightColored>
            <LoadingContainer loading={dataLoading} loaderHeight="50%">
              <StyledSectionValue hasButton={!!actions}>
                {address && value ? (
                  <AddressLink address={address} value={value} />
                ) : (
                  <Typography>{value || "-"}</Typography>
                )}
              </StyledSectionValue>
              {actions && (
                <Box>
                  {actions.map((a, index) => {
                    return (
                      <BaseButton key={index} onClick={a.action}>
                        {a.text}
                      </BaseButton>
                    );
                  })}
                </Box>
              )}
            </LoadingContainer>
          </StyledSectionRightColored>

          {description && <FieldDescription>{description}</FieldDescription>}
          {!dataLoading && <Message message={message} />}
        </StyledSectionRight>
      </StyledSection>
    </Box>
  );
};

const Message = ({ message }: { message?: JettonDetailMessage }) => {
  if (!message) {
    return null;
  }
  return (
    <StyledMessage type={message.type}>
      {message.type === "warning" ? (
        <WarningRoundedIcon />
      ) : (
        <CheckCircleRoundedIcon />
      )}

      {message.text}
    </StyledMessage>
  );
};

export { JettonPage };
