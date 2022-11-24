import { Box, styled } from "@mui/material";

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  color: "#000",
  alignItems: "center",
  gap: 4,
  "&:hover": {
    cursor: "pointer",
  },
  "& h4": {
    fontSize: 20,
    lineHeight: "20px",
    fontWeight: 800,
  },
  [theme.breakpoints.down("sm")]: {
    "& img": {
      width: 40,
    },
    "& h4": {
      fontSize: 15,
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: theme.spacing(0.5),
}));

export { LogoWrapper, ImageWrapper };
