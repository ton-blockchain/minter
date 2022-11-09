import { Typography } from "@mui/material";
import { APP_DISPLAY_NAME, ROUTES } from "consts";
import { useNavigate } from "react-router-dom";
import logo from "assets/icons/logo.svg";
import { LogoWrapper, ImageWrapper } from "./styled";

export const AppLogo = () => {
  const navigate = useNavigate();
  return (
    <LogoWrapper onClick={() => navigate(ROUTES.deployer)}>
      <ImageWrapper>
        <img src={logo} alt="Logo" />
      </ImageWrapper>
      <Typography variant="h4">{APP_DISPLAY_NAME}</Typography>
    </LogoWrapper>
  );
};
