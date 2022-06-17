import { Box, Skeleton, Typography } from "@mui/material";
import { Popup } from "components/Popup";
import { styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import WalletConnection from "services/wallet-connection";
import { Address } from "ton";
import { jettonDeployController } from "lib/deploy-controller";
import BaseButton from "components/BaseButton";

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  minHeight: "200px",
  justifyContent: "center",
  width: "550px",
  flexDirection: "column",
});

const StyledSection = styled(Box)({
  width: "100%",
  "& p": {
    fontSize: 14,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  "& h5": {
    fontSize: 16,
    fontWeight: 500,
  },
});

const StyledImage = styled(Box)({
  width: 200,
  height: 200,
});

const StyledFlex = styled(Box)({
  display: "flex",
  minHeight: 200,
  width: "100%",
});

const StyledButton = styled(Box)({
  marginTop: 50,
});

const StyledImagePlaceholder = styled(Box)({
  width:'100%',
  height: '100%',
  background:'black',
  opacity: 0.4
})

const StyledTextSections = styled(Box)({
  width: "calc(100% - 200px)",
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

interface Props {
  open: boolean;
  onClose: () => void;
  contractAddress: Address;
  address: Address;
}

function JetonDetailsModal({ open, onClose, contractAddress, address }: Props) {
  const [jettonDetails, setJettonDetails] = useState<any>({});
  const mounted = useRef(false);
  const { jetton, wallet } = jettonDetails;
  useEffect(() => {
    mounted.current = true;
    getJettonDetails();
    return () => {
      mounted.current = false;
    };
  }, []);

  const getJettonDetails = async () => {
    try {
      const connection = WalletConnection.getConnection();

      const res = await jettonDeployController.getJettonDetails(
        contractAddress,
        address,
        connection
      );
      console.log(res);

      if (mounted.current) {
        setJettonDetails(res);
      }
    } catch (error) {}
  };

  const textLoaderHeight = 30;

  return (
    <Popup open={open} onClose={onClose}>
      <StyledContainer>
        <StyledFlex>
          <StyledImage>
            {!jetton ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              jetton.image ? <img src={jetton.image} /> : 
              <StyledImagePlaceholder />

            )}
          </StyledImage>
          <StyledTextSections>
            <StyledSection>
              {jetton ? (
                <>
                  <Typography variant="h5">Jetton name:</Typography>
                  <Typography>{jetton.name}</Typography>
                </>
              ) : (
                <Skeleton
                  variant="text"
                  width="60%"
                  height={textLoaderHeight}
                />
              )}
            </StyledSection>
            <StyledSection>
              {jetton ? (
                <>
                  <Typography variant="h5">Jetton symbol:</Typography>
                  <Typography>{jetton.symbol}</Typography>
                </>
              ) : (
                <Skeleton
                  variant="text"
                  width="40%"
                  height={textLoaderHeight}
                />
              )}
            </StyledSection>
            <StyledSection>
              {jetton ? (
                <>
                  <Typography variant="h5">Jetton contract address:</Typography>
                  <Typography>{jetton.contractAddress}</Typography>
                </>
              ) : (
                <Skeleton
                  variant="text"
                  width="90%"
                  height={textLoaderHeight}
                />
              )}
            </StyledSection>
            <StyledSection>
              {wallet ? (
                <>
                  <Typography variant="h5">ownerJWallet address:</Typography>
                  <Typography>{wallet.ownerJWallet}</Typography>
                </>
              ) : (
                <Skeleton
                  variant="text"
                  width="90%"
                  height={textLoaderHeight}
                />
              )}
            </StyledSection>
          </StyledTextSections>
        </StyledFlex>
        <StyledButton>
          <BaseButton onClick={onClose}>Close</BaseButton>
        </StyledButton>
      </StyledContainer>
    </Popup>
  );
}

export default JetonDetailsModal;
