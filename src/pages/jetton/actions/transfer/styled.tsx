import { Box, styled } from "@mui/material";

const TransferWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const TransferContent = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 15,
});

const ButtonWrapper = styled(Box)({
  width: "100%",
  margin: "auto",
  marginTop: 30,
});

export { TransferWrapper, TransferContent, ButtonWrapper };
