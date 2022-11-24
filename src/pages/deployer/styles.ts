import { Box, styled, Typography } from "@mui/material";

const StyledTxLoaderContent = styled(Box)({
  textAlign: "center",
  "& p": {
    fontSize: 18,
    fontWeight: 500,
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
  background: "#fff",
  borderRadius: 16,
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0px 2px 16px rgb(114 138 150 / 8%)",

  "& p": {
    fontSize: 16,
    lineHeight: "24px",
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
  color: "#161C28",
  fontSize: 44,
  [theme.breakpoints.down("md")]: {
    fontSize: 28,
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(8),
  },
}));

const FormWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  gap: theme.spacing(5),
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
  },
}));

const SubHeadingWrapper = styled(Box)(({ theme }) => ({
  flex: 5,
  background: "#FFFFFF",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0px 2px 16px rgba(114, 138, 150, 0.08)",
  borderRadius: "24px",
  padding: theme.spacing(3),
}));

const FormHeading = styled(Typography)(({ theme }) => ({
  color: "#161C28",
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
