import { Alert, Box, Fade, styled, Typography } from "@mui/material";
import { JettonWalletState, MinterState } from "./types";
import AddressLink from "components/AddressLink";
import { useContext, useMemo, useState } from "react";
import { EnvContext } from "App";
import BaseButton from "components/BaseButton";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { Address } from "ton";
import { EMPTY_ADDRESS } from "consts";
import { createJettonDetailsContent } from "./util";



interface Props {
  jettonWallet: JettonWalletState;
  minter: MinterState;
  address: string;
}

const StyledContainer = styled(Box)({
  display: "flex",
  gap: 40,
  flexDirection: "column",
  width: "100%",
});

const StyledStatus = styled(Box)({
  display: "flex",
  gap: 40,
  flexDirection: "column",
  width: "100%",
});

const StyledImgBox = styled(Box)({
  width: 120,
  height: 120,
  borderRadius: "50%",
  overflow: "hidden",
  border: "2px solid rgba(0,0,0, 0.4)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
const StyledImgBoxPlaceholder = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledTextSections = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

const StyledSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 10,
  "& h4": {
    fontSize: 18,
    fontWeight: 500,
  },
});

function JettonDetails({ minter, jettonWallet, address }: Props) {
  const content = createJettonDetailsContent(minter, jettonWallet);
  const { isSandbox } = useContext(EnvContext);
  const [isAdmin, setIsAdmin] = useState(address === minter.admin);
  const [isLoading, setIsLoading] = useState(false);

  const isSafe = minter.admin === EMPTY_ADDRESS;

  const scannerUrl = useMemo(
    () =>
      isSandbox
        ? `https://sandbox.tonwhales.com/explorer/address`
        : `https://tonscan.org/jetton`,
    [isSandbox]
  );

  const burnAdmin = async () => {
    setIsLoading(true);
    try {
      await jettonDeployController.burnAdmin(
        Address.parse(jettonWallet.jettonMasterAddress),
        WalletConnection.getConnection()
      );
      setIsAdmin(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  console.log(minter);

  return (
    <Fade in>
      <StyledContainer>
        <StyledImgBox>
          {minter.image ? (
            <img src={minter.image} />
          ) : (
            <StyledImgBoxPlaceholder>No image</StyledImgBoxPlaceholder>
          )}
        </StyledImgBox>

        <StyledTextSections>
          {content.map((d) => {
            const { isAddress, title, value } = d;
            return (
              <StyledSection key={title}>
                <Typography variant="h4">{title}</Typography>
                {isAddress && value ? (
                  <AddressLink
                    text={value}
                    value={value}
                    href={`${scannerUrl}/${value}`}
                  />
                ) : (
                  <Typography>{value || "-"}</Typography>
                )}
              </StyledSection>
            );
          })}
        </StyledTextSections>
        {isAdmin && (
          <BaseButton loading={isLoading} onClick={burnAdmin}>
           Revoke ownership
          </BaseButton>
        )}
        {isSafe ? (
          <Alert severity="success">
            This token is safe (admin is zero address)
          </Alert>
        ) : (
          <Alert severity="warning">
            This token is not safe (admin is not zero address (OR: you are still
            the admin of this token))
          </Alert>
        )}
      </StyledContainer>
    </Fade>
  );
}

export default JettonDetails;
