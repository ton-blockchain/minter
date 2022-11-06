import React from "react";
import { Box, Typography } from "@mui/material";
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
import twitter from "assets/icons/twitter.svg";
import twitterHovered from "assets/icons/twitter-hover.svg";
import mail from "assets/icons/mail.svg";
import mailHovered from "assets/icons/mail-hover.svg";
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
          <HoverableIcon iconUrl={telegram} hoveredIconUrl={telegramHovered} link="" />
          <HoverableIcon
            iconUrl={github}
            hoveredIconUrl={githubHovered}
            link="https://github.com/ton-blockchain/minter-contract"
          />
          <HoverableIcon iconUrl={twitter} hoveredIconUrl={twitterHovered} link="" />
          <HoverableIcon iconUrl={mail} hoveredIconUrl={mailHovered} link="" />
        </SocialsContent>
      </SocialsWrapper>
      <Separator />
      <CredentialsWrapper>
        <Typography variant="body2">© 2022 TON Foundation</Typography>
        <Typography variant="body2">Support</Typography>
      </CredentialsWrapper>
    </FooterWrapper>
  );
};
