import { Box, Link, styled, Typography } from "@mui/material";
import { CenteringWrapper } from "components/footer/styled";

const PopupTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: "#161C28",
  fontSize: 20,
  fontWeight: 800,
  padding: 0,
  marginBottom: theme.spacing(3.4),
}));

const PopupDescription = styled(Typography)({
  fontSize: 14,
  opacity: 0.3,
  paddingLeft: "17px",
  color: "#313855",
  margin: "8px 0 4px 0",
});

const PopupContent = styled(CenteringWrapper)({
  position: "relative",
  width: "100%",
  padding: "0 16px",
});

const PopupLink = styled(Link)({
  color: "#9CADB6",
  textDecorationColor: "#9CADB6",
  fontWeight: 800,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
});

const LogoTextAreaWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  background: "#F7F9FB",
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  transition: "0.2s all",
  borderRadius: "24px", //40
  overflowWrap: "anywhere",
});

const LogoTextArea = styled("textarea")({
  resize: "none",
  width: "100%",
  flex: 1,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
  background: "#F7F9FB",
  outline: "none",
  color: "#728A96",
  fontFamily: "Mulish",
  fontSize: 16,
  caretColor: "#728A96",
  borderRadius: "24px",
  padding: "10px 20px",
  maxHeight: 97,
  "::-webkit-scrollbar": {
    display: "none",
  },
});

export { LogoTextArea, LogoTextAreaWrapper, PopupTitle, PopupContent, PopupDescription, PopupLink };
