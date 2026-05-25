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

const JettonFormTitle = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 300,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%", // ← полная ширина на мобилке
    fontSize: 16,
  },
}));

export { StyledForm, StyledFormInputs, StyledActionBtn, JettonFormTitle };
