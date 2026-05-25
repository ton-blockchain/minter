import { Box, Link, styled, Typography } from "@mui/material";
import { CenteringWrapper } from "components/footer/styled";

const PopupTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: 800,
  padding: 0,
  marginBottom: theme.spacing(3.4),
}));

const PopupDescription = styled(Typography)({
  fontSize: 14,
  opacity: 0.6,
  paddingLeft: "17px",
  color: "#93A5B8",
  margin: "8px 0 4px 0",
});

const PopupContent = styled(CenteringWrapper)({
  position: "relative",
  width: "100%",
  padding: "0 16px",
});

const PopupLink = styled(Link)({
  color: "#93A5B8",
  textDecorationColor: "#93A5B8",
  fontWeight: 800,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  "&:hover": {
    color: "#1EAEFB",
  },
});

const LogoTextAreaWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  background: "#131B25",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  transition: "0.2s all",
  borderRadius: "24px",
  overflowWrap: "anywhere",
});

const LogoTextArea = styled("textarea")({
  resize: "none",
  width: "100%",
  flex: 1,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  background: "#131B25",
  outline: "none",
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontSize: 16,
  caretColor: "#93A5B8",
  borderRadius: "24px",
  padding: "10px 20px",
  maxHeight: 97,
  "::-webkit-scrollbar": {
    display: "none",
  },
  "&::placeholder": {
    color: "#93A5B8",
  },
});

export { LogoTextArea, LogoTextAreaWrapper, PopupTitle, PopupContent, PopupDescription, PopupLink };
