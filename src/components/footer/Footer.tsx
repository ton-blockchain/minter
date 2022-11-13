import React from "react";
import { Box, Typography } from "@mui/material";
import { HoverableIcon } from "components/hoverableIcon/HoverableIcon";
import {
  CenteringWrapper,
  CredentialsWrapper,
  FooterContributedText,
  FooterLink,
  FooterLinkText,
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
import orbs from "assets/icons/orbs.svg";

export const Footer = () => {
  return (
    <FooterWrapper>
      <SocialsWrapper>
        <Box>
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
        <CenteringWrapper>
          <FooterContributedText variant="body2">contributed by: </FooterContributedText>
          <FooterLink target="_blank" href="https://www.orbs.com/">
            <img src={orbs} alt="Orbs logo" width={16} height={16} />
            <FooterLinkText variant="body2">ORBS</FooterLinkText>
          </FooterLink>
        </CenteringWrapper>
        <FooterLink target="_blank" href="https://t.me/+YDnoBue1Dz81ZTMy">
          <Typography variant="body2">Support</Typography>
        </FooterLink>
      </CredentialsWrapper>
    </FooterWrapper>
  );
};
