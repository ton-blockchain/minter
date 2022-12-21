import { Box, styled } from "@mui/material";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 30,
  width: "100%",
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(8),
  },
}));

const StyledCategory = styled(Box)(({ theme }) => ({
  width: "calc(50% - 15px)",
  padding: "20px 30px 30px 30px",
  borderRadius: 16,
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
  background: "#FFFFFF",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  borderRadius: 24,
  filter: "drop-shadow(0px 2px 16px rgba(114, 138, 150, 0.08))",
  height: "100%",
});

const StyledTop = styled(Box)({
  display: "flex",
  gap: 20,
  marginBottom: 30,
});

const StyledTopText = styled(Box)({
  color: "#27272E",
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
  width: 101,
  height: 101,
  borderRadius: "50%",
  overflow: "hidden",
  background: "rgba(0,0,0, 0.1)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    border: "2px solid #D9D9D9",
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
