import { Box } from "@mui/system";
import React, { useEffect, useRef } from "react";
import { HeaderMenu } from "components/header/headerMenu/HeaderMenu";
import { AppLogo } from "components/appLogo";
import { HeaderContent, HeaderWrapper } from "./styled";
import { Outlet } from "react-router-dom";
import { useNetwork } from "lib/hooks/useNetwork";
import { Typography } from "@mui/material";
import { AppButton } from "components/appButton";

export const Header = () => {
  const headerRef = useRef<null | HTMLDivElement>(null);
  const { network } = useNetwork();
  const isTestnet = network === "testnet";

  const switchNetwork = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateStuck = () => {
      header.classList.toggle("is-stuck", window.scrollY > 4);
    };
    updateStuck();
    window.addEventListener("scroll", updateStuck, { passive: true });
    return () => window.removeEventListener("scroll", updateStuck);
  }, []);

  return (
    <>
      <HeaderWrapper ref={headerRef}>
        <HeaderContent>
          <AppLogo />
          <Box sx={{ flex: 1 }} />
          <HeaderMenu />
        </HeaderContent>
      </HeaderWrapper>

      {isTestnet && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "fixed",
            top: 80,
            left: 0,
            right: 0,
            zIndex: 49,
            pointerEvents: "none",
          }}>
          <Box
            sx={{
              background: "rgba(29, 38, 51, 0.8)",
              backdropFilter: "blur(0.5px)",
              border: "0.5px solid rgba(114, 138, 150, 0.24)",
              boxShadow: "0 1px 1px 0 #2D3945 inset",
              borderRadius: "40px",
              padding: "6px 6px 6px 16px",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pointerEvents: "auto",
            }}>
            <Typography sx={{ color: "#93A5B8", fontSize: 13, whiteSpace: "nowrap" }}>
              You are on Testnet
            </Typography>
            <AppButton transparent onClick={switchNetwork} height={30} fontSize={12}>
              Switch to Mainnet
            </AppButton>
          </Box>
        </Box>
      )}

      <Outlet />
    </>
  );
};

export * from "./Header";
