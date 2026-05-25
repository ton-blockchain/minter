import { Box, styled, Typography } from "@mui/material";

const StyledTxLoaderContent = styled(Box)({
  textAlign: "center",
  "& p": {
    fontSize: 18,
    fontWeight: 500,
    color: "#FFFFFF",
  },
});

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  gap: 30,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: 30,
  },
}));

const StyledDescription = styled(Box)(({ theme }) => ({
  position: "relative",
  background: "rgba(29, 38, 51, 0.8)",
  backdropFilter: "blur(0.5px)",
  borderRadius: 16,
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0 1px 1px 0 #2D3945 inset, 0px 2px 16px rgba(0, 0, 0, 0.2)",
  color: "#93A5B8",
  display: "flex",
  flexDirection: "column",
  "& p": {
    fontSize: 16,
    lineHeight: "24px",
    color: "#93A5B8",
  },
  "& a": {
    color: "#1EAEFB",
  },
  "& h5": {
    color: "#FFFFFF",
  },
  [theme.breakpoints.down("md")]: {
    "& p": {
      fontSize: 14,
      lineHeight: "20px",
    },
  },
}));

const ScreenHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "#FFFFFF",
  fontSize: 44,
  [theme.breakpoints.down("md")]: {
    fontSize: 28,
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: 0,
    fontSize: 24,
  },
}));

const FormWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const SubHeadingWrapper = styled(Box)(({ theme }) => ({
  flex: 5,
  background: "rgba(29, 38, 51, 0.8)",
  backdropFilter: "blur(0.5px)",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0 1px 1px 0 #2D3945 inset, 0px 2px 16px rgba(0, 0, 0, 0.2)",
  borderRadius: "24px",
  padding: theme.spacing(3),
}));

const FormHeading = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: theme.spacing(3),
}));

export {
  StyledDescription,
  StyledContainer,
  StyledTxLoaderContent,
  ScreenHeading,
  FormWrapper,
  SubHeadingWrapper,
  FormHeading,
};
