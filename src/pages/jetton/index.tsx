import { Box, Typography } from "@mui/material";
import { JettonDetailButton, JettonDetailMessage } from "./types";
import AddressLink from "components/AddressLink";
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EnvContext } from "App";
import BaseButton from "components/BaseButton";
import { getAdminMessage, getSymbolWarning, getTotalSupplyWarning } from "./util";
import useNotification from "hooks/useNotification";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useParams } from "react-router-dom";
import { ScreenContent, Screen } from "components/Screen";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import TxLoader from "components/TxLoader";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import useJettonStore from "store/jetton-store/useJettonStore";
import Navbar from "components/navbar";
import { ROUTES } from "consts";
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
import { scannerUrl } from "utils";
import ReactMarkdown from "react-markdown";

function JettonPage() {
  const { id }: { id?: string } = useParams();

  const { address, isConnecting, toggleConnect } = useConnectionStore();
  const { showNotification } = useNotification();
  const getJettonOnLoadRef = useRef(false);
  const [txLoading, setTxLoading] = useState(false);

  const {
    getJettonDetails,
    jettonImage,
    isLoading,
    adminAddress,
    isAdmin,
    adminRevokedOwnership,
    balance,
    symbol,
    name,
    description,
    revokeAdminOwnership,
    jettonMaster,
    stopLoading,
    reset,
    persistenceType,
    totalSupply,
    jettonAddress
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

  useEffect(() => {
    if (!id) {
      stopLoading();
      return;
    }
    if (!getJettonOnLoadRef.current && !isConnecting) {
      getJettonDetails(id, address);
      getJettonOnLoadRef.current = true;
    }
  }, [id, getJettonDetails, isConnecting]);

  useEffect(() => {
    if (jettonMaster) {
      getJettonDetails(jettonMaster, address);
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
                  loading={isLoading}
                />
              </StyledTopImg>
              <StyledTopText>
                <LoadingContainer loading={isLoading} loaderWidth="80px">
                  <Typography variant="h3">{name}</Typography>
                </LoadingContainer>
                <LoadingContainer loading={isLoading} loaderWidth="150px">
                  {description && (
                    <Typography variant="h5">{description}</Typography>
                  )}
                </LoadingContainer>
              </StyledTopText>
            </StyledTop>

            <StyledTextSections>
            <Row
                description="On-chain smart contract address of the Jetton parent (jetton-minter.fc)"
                title="Minter Address"
                value={jettonMaster}
                dataLoading={isLoading}
                isAddress
              />
              <Row
                title="Admin"
                value={adminAddress}
                isAddress
                description="Account address that can mint tokens freely and change metadata"
                message={getAdminMessage(
                  adminAddress,
                  symbol,
                  adminRevokedOwnership,
                  isAdmin,
                  jettonMaster
                )}
                dataLoading={isLoading}
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
                dataLoading={isLoading}
                message={getSymbolWarning(
                  persistenceType,
                  adminRevokedOwnership
                )}
              />
              <Row
                title="Total supply"
                value={totalSupply && `${totalSupply} ${symbol}`}
                dataLoading={isLoading}
                message={getTotalSupplyWarning(
                  persistenceType,
                  adminRevokedOwnership,
                )}
              />
              <StyledCategoryTitle>Connected Jetton Wallet</StyledCategoryTitle>
              <Row
                title="Wallet address"
                value={address}
                dataLoading={isLoading}
                isAddress
              />
              <Row
                title="Balance"
                value={
                  balance && `${parseFloat(balance).toLocaleString()} ${symbol}`
                }
                dataLoading={isLoading}
                button={
                  !address
                    ? {
                        text: "Connect wallet",
                        action: () => toggleConnect(true),
                      }
                    : undefined
                }
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
  isAddress?: boolean | undefined;
  button?: JettonDetailButton | undefined;
  dataLoading: boolean;
  description?: string;
}

const Row = ({
  title,
  value,
  message,
  isAddress,
  button,
  dataLoading,
  description,
}: RowProps) => {
  const { isSandbox } = useContext(EnvContext);

  return (
    <Box>
      <StyledSection>
        <StyledSectionTitle>
          <Typography>{title}</Typography>
        </StyledSectionTitle>
        <StyledSectionRight>
          <StyledSectionRightColored>
            <LoadingContainer loading={dataLoading} loaderHeight="50%">
              <StyledSectionValue hasButton={!!button}>
                {isAddress && value ? (
                  <AddressLink
                    address={value}
                    href={`${scannerUrl(isSandbox)}/${value}`}
                  />
                ) : (
                  <Typography>{value || "-"}</Typography>
                )}
              </StyledSectionValue>
              {button && (
                <BaseButton onClick={button.action}>{button.text}</BaseButton>
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

function LinkRenderer({
  href,
  children,
}: any) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

const Message = ({ message }: { message?: JettonDetailMessage }) => {
  if (!message) {
    return null;
  }
  return (
    <StyledMessage type={message.type}>
      {message.type === "warning" ? (
        <WarningAmberRoundedIcon />
      ) : (
        <CheckCircleRoundedIcon />
      )}
      {message.text && (
        <ReactMarkdown components={{ a: LinkRenderer }}>
          {message.text}
        </ReactMarkdown>
      )}
    </StyledMessage>
  );
};

export { JettonPage };
