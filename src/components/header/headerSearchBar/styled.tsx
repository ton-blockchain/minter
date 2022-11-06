import { styled, Box } from "@mui/material";

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  margin: "auto",
  padding: "0px 17px",
  width: "100%",
  minHeight: 50,
  height: "100%",
  transition: "0.1s all",
  background: "#F7F9FB",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 40,
  [theme.breakpoints.down("md")]: {
    height: 40,
  },
}));

const SearchBarInput = styled("input")(({ theme }) => ({
  flex: 1,
  marginLeft: 6,
  width: "100%",
  fontSize: 16,
  fontWeight: 500,
  outline: "unset",
  fontFamily: "Mulish",
  color: "#000",
  border: "none",
  background: "#F7F9FB",
  caretColor: "#728A96",
  "&::placeholder": {
    color: "#728A96",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));

const SearchResultsWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 10px)",
  left: 0,

  padding: `${theme.spacing(1)}, ${theme.spacing(2)}`,
  zIndex: 99,

  background: "#F7F9FB",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 16,
  width: "100%",
  maxHeight: 450,
  overflowY: "auto",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const CenteringWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const SearchResultsItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "transparent",
  fontSize: 20,
  color: "#000",
  fontWeight: 500,
  height: 30,
  padding: "20px 30px 20px 50px",
  "&:hover": {
    cursor: "pointer",
    background: "rgba(232,233,235,.25)",
  },
}));

const IndentlessIcon = styled(Box)(() => ({
  padding: 0,
}));

export {
  SearchBarWrapper,
  SearchBarInput,
  IndentlessIcon,
  SearchResultsWrapper,
  SearchResultsItem,
  CenteringWrapper,
};
