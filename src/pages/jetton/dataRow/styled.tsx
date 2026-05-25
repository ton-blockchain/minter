import { Box, styled, Typography } from "@mui/material";
import theme from "theme";

const RowMessage = styled(Box)(({ type }: { type: string }) => ({
  maxWidth: "90%",
  display: "flex",
  alignItems: "flex-start",
  gap: 5,
  paddingLeft: 20,
  fontSize: 12,
  marginTop: 11,
  "& *": {
    color: type === "success" ? "#0EA438" : "#EEBD40",
  },
  "& svg": {
    color: type === "success" ? "#0EA438" : "#EEBD40",
    width: 16,
    position: "relative",
    top: -3,
  },
  "& p": {
    margin: 0,
    color: type === "success" ? "#0EA438" : "#EEBD40",
    "& a": {
      textDecoration: "none",
      fontWeight: 800,
      color: type === "success" ? "#0EA438" : "#EEBD40",
    },
  },
}));

const RowActionsButton = styled(Box)({
  height: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  "& .base-button": {
    height: "calc(100% - 16px)",
    marginRight: 5,
    padding: "0px 10px",
    fontSize: 13,
    fontWeight: 700,
    background: "#1EAEFB",
    color: "#fff",
    borderRadius: 24,
    "&:hover": {
      background: "#3db8fc",
    },
  },
});

const RowValueDisplayer = styled(Box)({
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0px 5px 0px 20px",
  background: "#131B25",
  borderRadius: 40,
  border: "0.5px solid rgba(114, 138, 150, 0.16)",
});

const RowTitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: "#93A5B8",
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(2.5),
}));

const RowContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const RowValueSection = styled(Box)(({ hasButton }: { hasButton?: boolean }) => ({
  width: hasButton ? "calc(100% - 140px)" : "100%",
  display: "flex",
  alignItems: "center",
  "& .address-link": {},
  "& p": {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: 20,
    color: "#FFFFFF",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  "& a": {
    color: "#1EAEFB !important",
  },
}));

export { RowMessage, RowTitle, RowContent, RowValueDisplayer, RowValueSection, RowActionsButton };
