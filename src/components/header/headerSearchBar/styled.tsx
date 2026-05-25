import { styled, Box } from "@mui/material";

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  display: "flex",
  alignItems: "center",
  margin: "auto",
  padding: "0px 17px",
  paddingRight: 10,
  width: "100%",
  minHeight: 50,
  height: "100%",
  transition: "0.1s all",
  background: "#131B25",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 40,
  overflow: "visible",
  [theme.breakpoints.down("md")]: {
    height: 40,
  },
}));

const SearchBarInput = styled("input")(({ theme }) => ({
  flex: 1,
  marginLeft: 10,
  width: "100%",
  fontSize: 16,
  fontWeight: 500,
  outline: "unset",
  fontFamily: "inherit",
  color: "#FFFFFF",
  border: "none",
  background: "transparent",
  caretColor: "#93A5B8",
  "&::placeholder": {
    color: "#93A5B8",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));

const SearchResultsWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 10px)",
  left: 0,
  zIndex: 999,
  background: "#1D2633",
  border: "0.5px solid #364459",
  borderRadius: 16,
  width: "100%",
  maxHeight: 450,
  overflowY: "auto",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.3)",
}));

const CenteringWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const SearchResultsItem = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "transparent",
  fontSize: 20,
  color: "#FFFFFF",
  fontWeight: 500,
  height: 30,
  padding: "20px 24px 20px 30px",
  transitionDuration: ".15s",
  "&:hover": {
    cursor: "pointer",
    background: "#222C3D",
  },
  "& p": {
    color: "#FFFFFF",
  },
}));

const IndentlessIcon = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginLeft: 14,
  padding: 0,
  "& img": {
    filter: "brightness(0) invert(0.6)",
  },
}));

export {
  SearchBarWrapper,
  SearchBarInput,
  IndentlessIcon,
  SearchResultsWrapper,
  SearchResultsItem,
  CenteringWrapper,
};
