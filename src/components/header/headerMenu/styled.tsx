import { Box, IconButton, styled, Typography } from "@mui/material";

const CloseMenuButton = styled(IconButton)({
  color: "#1EAEFB",
  position: "absolute",
  right: 10,
  top: 10,
});

const DrawerContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 60,
  background: "#10161F",
  height: "100%",
  "& .logo": {
    flexDirection: "column",
  },
}));

const StyledGithubIcon = styled("img")({
  height: "100%",
  objectFit: "contain",
  padding: 0,
  filter: "brightness(0) invert(1)",
});
const AppMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end", // ← прижать к правому краю
  gap: 11,
  height: 35,
  [theme.breakpoints.down("md")]: {
    gap: 20,
    height: "unset",
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF",
  fontWeight: 700,
  fontSize: 18,
  marginLeft: theme.spacing(1),
}));

export { CloseMenuButton, DrawerContent, AppMenu, HeaderTypography, StyledGithubIcon };
