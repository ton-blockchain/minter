import { Box, Link, styled, Typography } from "@mui/material";
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
  gap: theme.spacing(1.5),
}));

const CredentialsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: "#728A96",
  fontSize: 14,
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
}));

const Separator = styled("hr")(() => ({
  height: "1px",
  backgroundColor: "#e6e6e6",
  border: "none",
}));

const FooterLink = styled(Link)(() => ({
  display: "flex",
  alignItems: "center",
  color: "inherit",
  textDecoration: "none",
}));

const CenteringWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const FooterContributedText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(0.4),
  fontSize: 12,
}));

const FooterLinkText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(0.35),
  fontSize: 12,
  fontFamily: "Poppins",
  letterSpacing: ".1em",
}));

export {
  FooterWrapper,
  SocialsWrapper,
  SocialsContent,
  Separator,
  CredentialsWrapper,
  FooterLink,
  CenteringWrapper,
  FooterLinkText,
  FooterContributedText,
};
