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
    "& a": {
      textDecoration: "none",
      fontWeight: 800,
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
    background: "#0088CC",
    color: "#fff",
    borderRadius: 24,
    "&:hover": {
      background: "rgb(0, 95, 142)",
    },
  },
});

const RowValueDisplayer = styled(Box)({
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0px 5px 0px 20px",
  background: "#F7F9FB",
  borderRadius: 40,
});

const RowTitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
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
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}));

export { RowMessage, RowTitle, RowContent, RowValueDisplayer, RowValueSection, RowActionsButton };
