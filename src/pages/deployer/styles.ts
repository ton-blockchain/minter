import { Box, styled } from "@mui/material";

export const StyledTxLoaderContent = styled(Box)({
  textAlign: "center",
  "& p": {
    fontSize: 18,
    fontWeight: 500,
  },
});

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  gap: 30,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: 30,
  },
}));

export const StyledDescription = styled(Box)(({ theme }) => ({
  position: "relative",
  background: "#fff",
  borderRadius: 16,
  "& p": {
    fontSize: 15,
    lineHeight: "24px",
  },
  [theme.breakpoints.down("md")]: {
    "& p": {
      fontSize: 14,
      lineHeight: "20px",
    },
  },
}));
