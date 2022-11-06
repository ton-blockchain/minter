import { AppBar, styled } from "@mui/material";
import { Box } from "@mui/system";
import { APP_GRID } from "consts";

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  height: 200,
  background: "white",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  boxShadow: "0px 2px 16px rgba(114, 138, 150, 0.08)",
  borderRadius: "0px 0px 48px 48px",
  [theme.breakpoints.down("md")]: {
    paddingTop: 10,
    height: 80,
  },
  [theme.breakpoints.down("sm")]: {
    zIndex: 99,
    position: "fixed",
    left: 0,
    background: "white",
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "100%",
  margin: "0 auto",
  height: 100,
  [theme.breakpoints.down("lg")]: {
    width: "calc(100% - 50px)",
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    alignItems: "center",
  },
}));

const HeaderOptionalContent = styled(Box)(({ theme }) => ({
  flex: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    justifyContent: "flex-start",
  },
}));

export { HeaderWrapper, HeaderContent, HeaderOptionalContent };
