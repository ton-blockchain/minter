import { Box, styled } from "@mui/material";
const LogoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  color: "#FFFFFF",
  alignItems: "center",
  gap: 4,
  "&:hover": { cursor: "pointer" },
  "& h4": {
    fontSize: 20,
    lineHeight: "20px",
    fontWeight: 800,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
  },
  [theme.breakpoints.down("sm")]: {
    "& h4": {
      fontSize: 16,
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: theme.spacing(0.5),
}));

export { LogoWrapper, ImageWrapper };
