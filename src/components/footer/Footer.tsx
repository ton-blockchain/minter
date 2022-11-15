import React from "react";
import { Box, Typography } from "@mui/material";
import { HoverableIcon } from "components/hoverableIcon/HoverableIcon";
import {
  ContributedWrapper,
  CredentialsWrapper,
  FooterContributedText,
  FooterLink,
  FooterTextBoxLeft,
  FooterTextBoxRight,
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
import heart from "assets/icons/heart.svg";

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
        <FooterTextBoxLeft>
          <Typography variant="body2">© 2022 TON Foundation</Typography>
        </FooterTextBoxLeft>
        <ContributedWrapper>
          <FooterContributedText variant="body2">
            Contributed with {` `}
            <img src={heart} alt="Orbs logo" width={9} height={7} />
            {` `} by {` `}
            <FooterLink sx={{ color: "#CF84D1" }} target="_blank" href="https://www.orbs.com/">
              Orbs
            </FooterLink>
          </FooterContributedText>
        </ContributedWrapper>
        <FooterTextBoxRight>
          <FooterLink target="_blank" href="https://t.me/+YDnoBue1Dz81ZTMy">
            <Typography variant="body2">Support</Typography>
          </FooterLink>
        </FooterTextBoxRight>
      </CredentialsWrapper>
    </FooterWrapper>
  );
};
