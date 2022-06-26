import { Box, styled, Typography } from "@mui/material";
import { JettonDetailButton, JettonDetailMessage } from "./types";
import AddressLink from "components/AddressLink";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { EnvContext } from "App";
import BaseButton from "components/BaseButton";
import { getAdminMessage } from "./util";
import useNotification from "hooks/useNotification";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useParams } from "react-router-dom";
import  { ScreenContent, Screen } from "components/Screen";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import ConnectPopup from "components/connect-popup";
import TxLoader from "components/TxLoader";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import useJettonStore from "store/jetton-store/useJettonStore";
import Navbar from "components/navbar";
import { ROUTES } from "consts";
const StyledSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",

  gap: 15,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: 5,
  },
}));

const StyledMessage = styled(Box)(({ type }: { type: string }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 5,
  paddingLeft: 10,
  fontSize: 13,
  marginTop: 5,
  color: type === "info" ? "#27272E" : "#EE404C",
  "& svg": {
    color: type === "info" ? "#27272E" : "#EE404C",
    width: 16,
    position: "relative",
    top: -3,
  },
}));

const StyledSectionTitle = styled(Box)(({ theme }) => ({
  width: 130,
  paddingLeft: 10,
  paddingTop: 14,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    paddingLeft: 0,
    paddingTop: 0,
  },
}));

const StyledSectionRight = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "calc(100% - 145px)",

  "& button": {
    paddingTop: 0,
    paddingBottom: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: 12,
  },
  "& .base-button": {
    height: "calc(100% - 10px)",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const StyledSectionRightColored = styled(Box)({
  borderRadius: 10,
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0px 5px 0px 20px",
  background: "#EDF2F7",
});

const StyledSectionValue = styled(Box)(
  ({ hasButton }: { hasButton: boolean }) => ({
    width: hasButton ? "calc(100% - 140px)" : "100%",
    display: "flex",
    alignItems: "center",
    "& .address-link": {},
    "& p": {
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      paddingRight: 20,
    },
  })
);

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 30,
  flexDirection: "column",
  width: "100%",
  maxWidth: 600,
  marginLeft: "auto",
  marginRight: "auto",
  padding: "60px 20px",
  [theme.breakpoints.down("sm")]: {
    padding: "30px 20px",
  },
}));

const StyledTop = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 30,
});

const StyledTopText = styled(Box)({
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
function JettonScreen() {
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
    jettonAddress,
    stopLoading,
    reset
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
    if (jettonAddress) {
      
      getJettonDetails(jettonAddress, address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, getJettonDetails]);


  useEffect(() => {
  
    return () => {
      reset()
    }
  }, [reset])
  

  return (
    <Screen>
      <Navbar customLink={{text: 'Create Jetton', path: ROUTES.deployer}} />
      <TxLoader open={txLoading}></TxLoader>
      
      <ScreenContent>
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
            title="Admin"
            value={adminAddress}
            isAddress
            message={getAdminMessage(
              adminRevokedOwnership,
              isAdmin,
              jettonAddress
            )}
            dataLoading={isLoading}
            button={
              isAdmin
                ? {
                    text: "Revoke ownership",
                    action: () => onRevokeAdminOwnership(jettonAddress),
                  }
                : undefined
            }
          />
          <Row
            title="Address"
            value={jettonAddress}
            dataLoading={isLoading}
            isAddress
          />
          <Row title="Symbol" value={symbol} dataLoading={isLoading} />
          <Row
            title="Jetton Wallet"
            value={address}
            dataLoading={isLoading}
            isAddress
          />
          <Row
            title="Balance"
            value={balance && `${balance} ${symbol}s`}
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
}

const Row = ({
  title,
  value,
  message,
  isAddress,
  button,
  dataLoading,
}: RowProps) => {
  const { isSandbox } = useContext(EnvContext);

  const scannerUrl = useMemo(
    () =>
      isSandbox
        ? `https://sandbox.tonwhales.com/explorer/address`
        : `https://tonscan.org/jetton`,
    [isSandbox]
  );

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
                    href={`${scannerUrl}/${value}`}
                  />
                ) : (
                  <Typography>{value || '-'}</Typography>
                )}
              </StyledSectionValue>
              {button && (
                <BaseButton onClick={button.action}>{button.text}</BaseButton>
              )}
            </LoadingContainer>
          </StyledSectionRightColored>

          {message && !dataLoading && (
            <StyledMessage type={message.type}>
              {message.type === "warning" ? (
                <WarningRoundedIcon />
              ) : (
                <CheckCircleRoundedIcon />
              )}

              {message.text}
            </StyledMessage>
          )}
        </StyledSectionRight>
      </StyledSection>
    </Box>
  );
};

export { JettonScreen };
