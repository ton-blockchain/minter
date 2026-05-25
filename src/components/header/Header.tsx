import { IconButton, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { HeaderMenu } from "components/header/headerMenu/HeaderMenu";
import { AppLogo } from "components/appLogo";
import { HeaderContent, HeaderWrapper } from "./styled";
import { Outlet, useLocation } from "react-router-dom";
export const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");
  const location = useLocation();
  const headerRef = useRef<null | HTMLDivElement>(null);

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
      <Outlet />
    </>
  );
};
export * from "./Header";
