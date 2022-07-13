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

export const StyledLeft = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  width: 496,
  gap: 30,
  [theme.breakpoints.down("lg")]: {
    width: 396,
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

export const StyledDescription = styled(Box)(({ theme }) => ({
  padding: "20px 30px 30px 30px",
  position: "relative",
  height: "100%",
  background: "#F0F0F0",
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
