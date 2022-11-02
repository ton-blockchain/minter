import { Box, styled } from "@mui/material";
import { APP_GRID } from "consts";

const FooterWrapper = styled(Box)(() => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  margin: "auto",
}));

const SocialsWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const SocialsContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

const CredentialsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(2),
  color: "#728A96",
  fontSize: 14,
}));

const Separator = styled("hr")(() => ({
  height: "1px",
  backgroundColor: "#e6e6e6",
  border: "none",
}));

export { FooterWrapper, SocialsWrapper, SocialsContent, Separator, CredentialsWrapper };
