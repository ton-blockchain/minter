import { IconButton, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { HeaderMenu, MobileMenu } from "components/header/headerMenu/HeaderMenu";
import { AppLogo } from "components/appLogo";
import { SearchBar } from "components/header/headerSearchBar";
import { HeaderContent, HeaderOptionalContent, HeaderWrapper } from "./styled";

export const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");

  return (
    <HeaderWrapper position="static">
      <HeaderContent>
        <HeaderOptionalContent>
          {!matches && (
            <IconButton onClick={() => setMobileMenu(true)}>
              <MenuRoundedIcon style={{ width: 40, height: 40, color: "#50A7EA" }} />
            </IconButton>
          )}
          {matches && <AppLogo />}
          {matches && <HeaderMenu />}
        </HeaderOptionalContent>
        <Box sx={{ width: "100%" }}>
          <SearchBar closeMenu={() => setMobileMenu(false)} />
          <Typography
            sx={{
              fontSize: 14,
              marginTop: 5,
              opacity: 0.3,
              paddingLeft: 13,
              color: "black",
              display: "inline",
              p: 0,
              m: 0,
              ml: 5,
            }}>
            Enter an existing Jetton contract address,
            <Typography
              sx={{
                color: "black",
                display: "inline",
                fontWeight: 800,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              variant="body2"
              onClick={() => console.log("ass")}>
              {" "}
              example
            </Typography>
          </Typography>
        </Box>
        <MobileMenu showMenu={mobileMenu && !matches} closeMenu={() => setMobileMenu(false)} />
      </HeaderContent>
    </HeaderWrapper>
  );
};
