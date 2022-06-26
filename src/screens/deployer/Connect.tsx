import BaseButton from "components/BaseButton";
import HeroImg from "assets/connect.png";
import { Fade, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import useConnectionStore from "store/connection-store/useConnectionStore";

const StyledImage = styled("img")({

  height: 198,
  maxHeight:'30vw',
  marginBottom: 23,
  marginTop: 23,
  objectFit: "contain",
});

const StyledConnectButton = styled(Box)({
  marginTop: 70,
  width: 344,
  height: 46,
  maxWidth:'100%',
  "& .base-button":{
    width: '100%',
    height: '100%',
    "& button" :{
      padding: 0,
      width:'100%',
      height: '100%'
    }
  }
});

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "70px 0px 70px 0px",
  [theme.breakpoints.down('sm')]: {
    padding: "30px 0px 30px 0px",
  },
}));

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  marginBottom: 50,
  gap: 5,
  "& h3": {
    fontSize: 28,
    fontWeight: 600,
    textAlign: "center",
  },
});

function Connect() {
  const {toggleConnect} = useConnectionStore()
    return (
    <Fade in>
    <StyledContainer>
      <StyledHeader>
        <Typography variant="h3">
          An open source tool to create jettons
        </Typography>
      </StyledHeader>

      <StyledImage src={HeroImg} />
      <StyledConnectButton>
        <BaseButton  onClick={() => toggleConnect(true)}>
          Connect wallet
        </BaseButton>
      </StyledConnectButton>
    </StyledContainer>
  </Fade>
  );
}

export { Connect };
