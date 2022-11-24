import { Box, IconButton, styled, Typography } from "@mui/material";

const CloseMenuButton = styled(IconButton)({
  color: "#50A7EA",
  position: "absolute",
  right: 10,
  top: 10,
});

const DrawerContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 60,
  "& .logo": {
    flexDirection: "column",
  },
}));

const StyledGithubIcon = styled("img")({
  height: "100%",
  objectFit: "contain",
  padding: 0,
});

const AppMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 11,
  height: 35,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    width: "calc(100vw - 60px)",
    maxWidth: 400,
    padding: "40px 30px 40px 30px",
    gap: 20,
    height: "unset",
    "& .connected-section": {
      order: 1,
      width: "100%",
      maxWidth: "unset",
      height: 35,
      marginTop: 40,
      "& p": {
        maxWidth: "unset",
      },
    },
    "& .github-icon": {
      order: 4,
      marginTop: 40,
    },
    "& .custom-link": {
      order: 3,
      width: "100%",
      height: 35,
      "& .base-button": {
        width: "100%",
      },
    },
  },
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  color: "#000",
  fontWeight: 700,
  fontSize: 18,
  marginLeft: theme.spacing(1),
}));

export { CloseMenuButton, DrawerContent, AppMenu, HeaderTypography, StyledGithubIcon };
