import { Box, styled, Typography } from "@mui/material";

const StyledForm = styled("form")({
  overflow: "hidden",
});

const StyledFormInputs = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 17,
});

const StyledActionBtn = styled(Box)({
  marginTop: 30,
  marginBottom: 10,
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  "& .base-button": {
    maxWidth: 150,
    width: "100%",
  },
});

const JettonFormTitle = styled(Typography)({
  color: "#161C28",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 0.5,
});

const JettonFormDescription = styled(Typography)({
  color: "#728A96",
  fontSize: "16px",
  wordBreak: "break-all",
  maxWidth: 350,
});

export { StyledForm, StyledFormInputs, StyledActionBtn, JettonFormTitle, JettonFormDescription };
