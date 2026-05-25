import { Box, styled } from "@mui/material";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 30,
  width: "100%",
  marginTop: theme.spacing(3),
  alignItems: "stretch",
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(8),
  },
}));

const StyledCategory = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "20px 30px 30px 30px",
  borderRadius: 16,
  boxSizing: "border-box",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    padding: "20px 25px 20px 25px",
  },
}));

const StyledCategoryFields = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

const StyledBlock = styled(StyledCategory)({
  background: "rgba(29, 38, 51, 0.8)",
  backdropFilter: "blur(0.5px)",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0 1px 1px 0 #2D3945 inset, 0px 2px 16px rgba(0, 0, 0, 0.2)",
  borderRadius: 24,
  height: "100%",
});

const StyledTop = styled(Box)({
  display: "flex",
  gap: 20,
  marginBottom: 30,
});

const StyledTopText = styled(Box)({
  color: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  gap: 3,
  flex: 1,
  "& h5": {
    fontSize: 15,
    fontWeight: 400,
  },
  "& h3": {
    fontSize: 19,
    fontWeight: 600,
  },
});

const StyledTopImg = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  overflow: "hidden",
  background: "transparent",
  border: "1px solid #364459",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  [theme.breakpoints.down("sm")]: {
    width: 56,
    height: 56,
  },
}));

export {
  StyledBlock,
  StyledTop,
  StyledTopImg,
  StyledTopText,
  StyledCategory,
  StyledCategoryFields,
  StyledContainer,
};
