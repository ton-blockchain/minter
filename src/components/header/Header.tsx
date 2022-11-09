import { IconButton, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { HeaderMenu, MobileMenu } from "components/header/headerMenu/HeaderMenu";
import { AppLogo } from "components/appLogo";
import { SearchBar } from "components/header/headerSearchBar";
import {
  HeaderContent,
  HeaderExampleText,
  HeaderOptionalContent,
  HeaderWrapper,
  HeaderExampleLink,
  HeaderExampleTextWrapper,
} from "./styled";
import { EXAMPLE_ADDRESS } from "consts";

export const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");
  const [example, setExample] = useState<string | undefined>(undefined);

  const resetExample = useCallback(() => {
    setExample(undefined);
  }, []);

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
          <SearchBar
            example={example}
            resetExample={resetExample}
            closeMenu={() => setMobileMenu(false)}
          />
          <HeaderExampleTextWrapper>
            <HeaderExampleText>
              Enter an existing Jetton contract address.
              <HeaderExampleLink variant="body2" onClick={() => setExample(EXAMPLE_ADDRESS)}>
                {" "}
                example
              </HeaderExampleLink>
            </HeaderExampleText>
          </HeaderExampleTextWrapper>
        </Box>
        <MobileMenu showMenu={mobileMenu && !matches} closeMenu={() => setMobileMenu(false)} />
      </HeaderContent>
    </HeaderWrapper>
  );
};
