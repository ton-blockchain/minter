import {
  FooterWrapper,
  FooterBrand,
  FooterLinks,
  FooterColumn,
  FooterLink,
  PoweredBy,
  FlagIcon,
} from "./styled";
import { Outlet } from "react-router-dom";
import { useNetwork } from "../../lib/hooks/useNetwork";
import { AppLogo } from "components/appLogo";

import { Box, Link, Typography } from "@mui/material";

export const Footer = () => {
  const { network } = useNetwork();
  const isTestnet = network === "testnet";
  return (
    <>
      <FooterWrapper>
        <FooterBrand>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AppLogo />
            <Typography sx={{ color: "#93A5B8", fontSize: 16 }}>
              © {new Date().getFullYear()}
            </Typography>
          </Box>
          <PoweredBy sx={{ color: "#FFFFFF", display: "flex", alignItems: "center", gap: 0.5 }}>
            <span>Powered by</span>
            <Link
              href="https://t.me/durov/482"
              target="_blank"
              sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 500 }}>
              MTONGA
            </Link>
            <FlagIcon />
          </PoweredBy>
          <Box sx={{ color: "#FFFFFF", fontSize: 16 }}>
            Contributed by{" "}
            <Link
              href="https://orbs.com/"
              target="_blank"
              sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 500 }}>
              Orbs
            </Link>
          </Box>
          <Box sx={{ color: "#FFFFFF", fontSize: 16 }}>
            Design by{" "}
            <Link
              href="https://t.me/socia"
              target="_blank"
              sx={{ color: "#1EAEFB", textDecoration: "none", fontWeight: 500 }}>
              Socia
            </Link>
          </Box>
        </FooterBrand>
        <FooterLinks>
          <FooterColumn>
            <FooterLink href="https://t.me/tondev_eng" target="_blank">
              Dev Chat
            </FooterLink>
            <FooterLink href="https://t.me/addlist/9ZlvcewREBw4NmJi" target="_blank">
              Dev Channels
            </FooterLink>
            <FooterLink href="https://github.com/ton-blockchain" target="_blank">
              GitHub
            </FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterLink href="https://ton.org/toolset/">Toolset</FooterLink>
            <FooterLink href="https://docs.ton.org/" target="_blank">
              Docs
            </FooterLink>
            <FooterLink href="https://t.me/ton_minter" target="_blank">
              Help Chat
            </FooterLink>
          </FooterColumn>
        </FooterLinks>
        <Outlet />
      </FooterWrapper>
    </>
  );
};

export * from "./Footer";
