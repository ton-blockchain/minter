import { Box, IconButton, styled, Typography } from "@mui/material";
import { APP_DISPLAY_NAME, ROUTES } from "consts";
import { useNavigate } from "react-router-dom";
import LogoImg from "assets/logo.svg";

const StyledLogo = styled(Box)(({ theme }) => ({
  display: "flex",
  color: "#6D6D6D",
  alignItems: "center",
  gap: 4,
  "& h4": {
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 700,
  },
  [theme.breakpoints.down("sm")]: {
    "& img": {
      width: 40,
    },
    "& h4": {
      fontSize: 15,
    },
  },
}));

function Logo() {
  const navigate = useNavigate();
  return (
    <StyledLogo className="logo" onClick={() => navigate(ROUTES.deployer)}>
      <IconButton>
        <img src={LogoImg} />
      </IconButton>
      <Box>
        <Typography variant="h4">{APP_DISPLAY_NAME}</Typography>
      </Box>
    </StyledLogo>
  );
}

export default Logo;
