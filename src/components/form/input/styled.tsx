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
  background: "#131B25",
  border: `0.5px solid ${error ? "#ef5350" : "rgba(114, 138, 150, 0.16)"}`,
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
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontSize: 16,
  caretColor: "#93A5B8",
  "&::placeholder": {
    color: "#93A5B8",
    fontFamily: "inherit",
    transition: "0.2s all",
  },
  "&:focus": {
    "&::placeholder": {
      opacity: 0,
    },
  },
});

export { StyledInput, StyledInputContainer, StyledContainer };
