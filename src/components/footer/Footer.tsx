import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { HoverableIcon } from "components/hoverableIcon/HoverableIcon";
import {
  CredentialsWrapper,
  FooterWrapper,
  Separator,
  SocialsContent,
  SocialsWrapper,
} from "./styled";
import telegram from "assets/icons/telegram.svg";
import telegramHovered from "assets/icons/telegram-hover.svg";
import github from "assets/icons/github.svg";
import githubHovered from "assets/icons/github-hover.svg";
import { AppLogo } from "components/appLogo";

export const Footer = () => {
  return (
    <FooterWrapper>
      <SocialsWrapper>
        <Box mb={2}>
          <AppLogo />
        </Box>
        <SocialsContent>
          <HoverableIcon
            iconUrl={telegram}
            hoveredIconUrl={telegramHovered}
            link="https://t.me/+YDnoBue1Dz81ZTMy"
          />
          <HoverableIcon
            iconUrl={github}
            hoveredIconUrl={githubHovered}
            link="https://github.com/ton-blockchain/minter"
          />
        </SocialsContent>
      </SocialsWrapper>
      <Separator />
      <CredentialsWrapper>
        <Typography variant="body2">© 2022 TON Foundation</Typography>
        <Link
          target="_blank"
          href="https://t.me/+YDnoBue1Dz81ZTMy"
          sx={{ color: "inherit", textDecoration: "none" }}>
          <Typography variant="body2">Support</Typography>
        </Link>
      </CredentialsWrapper>
    </FooterWrapper>
  );
};
