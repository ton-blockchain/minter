import { styled, Box } from "@mui/material";

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: "auto",
  padding: "0px 17px",
  width: "100%",
  minHeight: 35,
  height: "100%",
  transition: "0.1s all",
  background: "#F7F9FB",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 20,
  [theme.breakpoints.down("sm")]: {
    minHeight: "unset",
    height: 40,
  },
}));

const SearchBarInput = styled("input")(({ theme }) => ({
  flex: 1,
  marginLeft: 6,
  width: "100%",
  fontSize: 12,
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

const IndentlessIcon = styled(Box)(() => ({
  padding: 0,
}));

export { SearchBarWrapper, SearchBarInput, IndentlessIcon };
