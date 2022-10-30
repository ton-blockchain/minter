import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "components/navbar/Logo";
import { APP_GRID } from "consts";
import LogoImg from "assets/telegram.svg";

export const Footer = () => {
  return (
    <Box
      sx={{
        margin: "auto",
        maxWidth: APP_GRID,
        width: "calc(100% - 50px)",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Logo />
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <img alt="Icon" src={LogoImg} />
          <img alt="Icon" src={LogoImg} />
          <img alt="Icon" src={LogoImg} />
          <img alt="Icon" src={LogoImg} />
        </Box>
      </Box>
      <hr
        style={{
          height: "1px",
          backgroundColor: "#e6e6e6",
          border: "none",
        }}
      />
      <Box
        mt={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Typography variant="body2">© TON Foundation</Typography>
        <Typography variant="body2">Support</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
