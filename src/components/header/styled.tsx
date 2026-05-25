import { AppBar, styled } from "@mui/material";
import { Box } from "@mui/system";
import { APP_GRID } from "consts";

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  height: 80,
  background: "transparent",
  border: "none",
  boxShadow: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10000000,
  transition: "background-color .2s ease, box-shadow .2s ease",
  "&.is-stuck": {
    background: "#10161f",
    boxShadow: "inset 0 -0.5px 0 #364459",
    backdropFilter: "blur(14px)",
    backgroundColor: "rgba(6, 10, 18, 0.78)",
  },
  [theme.breakpoints.down("sm")]: {
    height: 60,
    zIndex: 99,
  },
}));
const HeaderContent = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  margin: "0 auto",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

export { HeaderWrapper, HeaderContent };
