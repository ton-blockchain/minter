import BaseButton from "components/BaseButton";
import Screen from "components/Screen";
import React, { useEffect, useState } from "react";
import ConnectModal from "./ConnectModal";
import HeroImg from "assets/hero.svg";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import useMainStore from "store/main-store/useMainStore";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "consts";

const StyledImage = styled("img")({
  maxWidth: 400,
  width:'100%',
  marginBottom:50,
  marginTop: 40
});

const StyledContainer = styled(Box)({
  display:'flex',
  alignItems:'center',
  flexDirection:'column'
})

const StyledTitle = styled('p')({
  fontSize: 30,
  fontWeight: 500,
  margin: 0
})

function ConnectScreen() {
  const [showConnect, setShowConnect] = useState(false);
  const {address} = useConnectionStore()
  const navigate = useNavigate()

  useEffect(() => {
    if(address){
      navigate(ROUTES.deployer)
    }
  }, [address])
  
  return (
    <Screen>
      <StyledContainer>
        <StyledTitle>Jetton Deployer</StyledTitle>
      <StyledImage src={HeroImg} />
      <BaseButton fontSize={18} minWidth ={260} onClick={() => setShowConnect(true)}>
        Connect wallet
      </BaseButton>
      </StyledContainer>
      <ConnectModal open={showConnect} onClose={() => setShowConnect(false)} />
    </Screen>
  );
}

export { ConnectScreen };
