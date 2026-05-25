import { Box, Link, styled, Typography } from "@mui/material";

const FooterWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 48,
  borderTop: "0.5px solid #364459",
  paddingBlock: "48px 80px",
  paddingInline: "max(32px, calc((100% - 1160px) / 2 + 32px))",
  width: "100%",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
  [theme.breakpoints.down("sm")]: {
    gap: 24,
    padding: "32px 24px 48px",
  },
}));

const FooterBrand = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  [theme.breakpoints.down("sm")]: {
    borderBottom: "0.5px solid #364459",
    paddingBottom: 24,
  },
}));

const PoweredBy = styled(Typography)({});

const FlagIcon = styled("span")({
  display: "inline-block",
  width: 24,
  height: 24,
  lineHeight: 0,
  flexShrink: 0,
});

const FooterLinks = styled("nav")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  [theme.breakpoints.down("sm")]: {
    gap: 16,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    maxWidth: 327,
    width: "100%",
    paddingTop: 8,
  },
}));

const FooterColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 14,
  "& a, & span": {
    color: "#93A5B8",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.4,
    textDecoration: "none",
  },
  "& a:hover": {
    color: "#1EAEFB",
  },
});

const FooterLink = styled(Link)({});

const CenteringWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export {
  FooterWrapper,
  FooterBrand,
  FooterLinks,
  FooterColumn,
  FooterLink,
  PoweredBy,
  FlagIcon,
  CenteringWrapper,
};
