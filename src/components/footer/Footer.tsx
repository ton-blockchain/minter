import React from "react";
import { Box, Typography } from "@mui/material";
import { HoverableIcon } from "components/hoverableIcon/HoverableIcon";
import {
  CenteringWrapper,
  ContributedWrapper,
  CredentialsWrapper,
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
import orbsLogo from "assets/icons/orbs.svg";
import githubHovered from "assets/icons/github-hover.svg";
import { AppLogo } from "components/appLogo";
import heart from "assets/icons/heart.svg";
import { Outlet } from "react-router-dom";

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
          <Typography variant="body2">© 2023 TON Foundation</Typography>
        </FooterTextBoxLeft>
        <ContributedWrapper>
          <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
            Contributed with
            <CenteringWrapper mx={0.4}>
              <img src={heart} alt="Orbs logo" width={12} height={12} />
            </CenteringWrapper>
            by
            <CenteringWrapper mx={0.4}>
              <img src={orbsLogo} alt="Orbs logo" width={12} height={12} />
            </CenteringWrapper>
            <FooterLink
              sx={{ color: "#5E75E8", display: "flex", alignItems: "center" }}
              target="_blank"
              href="https://orbs.com/">
              Orbs
            </FooterLink>
          </Typography>
        </ContributedWrapper>
        <FooterTextBoxRight>
          <FooterLink target="_blank" href="https://t.me/+YDnoBue1Dz81ZTMy">
            <Typography variant="body2">Support</Typography>
          </FooterLink>
        </FooterTextBoxRight>
      </CredentialsWrapper>
      <Outlet />
    </FooterWrapper>
  );
};
