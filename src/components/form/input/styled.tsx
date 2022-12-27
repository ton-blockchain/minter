import { Box, styled } from "@mui/material";

const StyledContainer = styled(Box)({
  width: "100%",
  overflow: "auto",
});

const StyledInputContainer = styled(Box)(({ error }: { error: boolean }) => ({
  width: "100%",
  height: 45,
  display: "flex",
  alignItems: "center",
  background: "#F7F9FB",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  borderRadius: 40,
  paddingRight: 5,
  transition: "0.2s all",
  "& .base-button": {
    height: "calc(100% - 10px)",
    padding: "0px 15px",
    fontSize: 12,
  },
}));

const StyledInput = styled("input")({
  flex: 1,
  height: "100%",
  border: "unset",
  textIndent: 16,
  background: "transparent",
  outline: "none",
  color: "#000",
  fontFamily: "Mulish",
  fontSize: 16,
  caretColor: "#728A96",
  "&::placeholder": {
    color: "#728A96",
    fontFamily: "Mulish",
    transition: "0.2s all",
  },
  "&:focus": {
    "&::placeholder": {
      opacity: 0,
    },
  },
});

export { StyledInput, StyledInputContainer, StyledContainer };
