import { styled, TextField } from "@mui/material";
import { Box } from "@mui/system";
import Screen from "components/Screen";
import { jettonDeployController } from "lib/deploy-controller";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import WalletConnection from "services/wallet-connection";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Address, fromNano } from "ton";
import ContentLoader from "./ContentLoader";
import JettonDetails from "./JettonDetails";
import SearchInput from "./SearchInput";
import { JettonWalletState, MinterState } from "./types";



const StyledContainer = styled(Box)({
  width: "100%",
  maxWidth: 700,
});

function JettonScreen() {
  const { id }: { id?: string } = useParams();
  const { address } = useConnectionStore();
  const getJettonOnLoadRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [minter, setMinter] = useState<MinterState | null>(null);
  const [jettonWallet, setJettonWallet] = useState<JettonWalletState | null>(
    null
  );


  useEffect(() => {
    if (id && !getJettonOnLoadRef.current && address) {
      getJettonDetails(id);
      getJettonOnLoadRef.current = true;
    }
  }, [address, id]);

  const getJettonDetails = async (id: string) => {
    if(!address){
        return 
    }
    setJettonWallet(null);
    setMinter(null);
    setIsLoading(true);
    try {
      const result = await jettonDeployController.getJettonDetails(
        Address.parse(id),
        Address.parse(address),
        WalletConnection.getConnection()
      );
      const { minter, jettonWallet } = result;

      setMinter({
        ...minter,
        admin: Address.normalize(minter.admin),
      });
      setJettonWallet({
        balance: fromNano(jettonWallet.balance),
        jWalletAddress: Address.normalize(jettonWallet.jWalletAddress),
        jettonMasterAddress: Address.normalize(
          jettonWallet.jettonMasterAddress
        ),
      });


    } catch (error) {
        console.log(error);
        
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <Screen>
      <StyledContainer>
       <SearchInput  submit = {getJettonDetails} />
        {minter && jettonWallet && address && !isLoading ? (
          <JettonDetails address={address} minter={minter} jettonWallet={jettonWallet} />
        ) : (
          <ContentLoader />
        )}
      </StyledContainer>
    </Screen>
  );
}

export { JettonScreen };
