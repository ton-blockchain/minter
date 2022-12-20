import React from "react";
import { Popup } from "components/Popup";
import { Box, Typography } from "@mui/material";
import { CenteringWrapper } from "components/header/headerSearchBar/styled";
import { AppButton } from "components/appButton";
import openLink from "assets/icons/link-open.svg";
import { PopupLink, PopupTitle } from "components/editLogoPopup/styled";

interface LogoAlertPopupProps {
  showPopup: boolean;
  close: () => void;
  onValidate: any;
  isUpdateText: boolean;
}

export const LogoAlertPopup = ({
  showPopup,
  close,
  onValidate,
  isUpdateText,
}: LogoAlertPopupProps) => {
  return (
    <Popup open={showPopup} onClose={close} maxWidth={592}>
      <PopupTitle>Token logo is broken</PopupTitle>
      <Typography sx={{ alignSelf: "baseline" }} mb={0.5}>
        Your token <span style={{ fontWeight: 700 }}>does not have a working logo.</span>
      </Typography>
      <Typography sx={{ alignSelf: "baseline", lineHeight: 2 }}>
        You can fix this later by editing the token's metadata, as long as you're <br />
        still the token admin.
      </Typography>
      <Box sx={{ alignSelf: "baseline" }} mx={2} mt={1}>
        <PopupLink
          href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices"
          target="_blank">
          Best practices for storing logo
          <img alt="Open icon" src={openLink} width={11} height={11} style={{ marginLeft: 4 }} />
        </PopupLink>
      </Box>
      <CenteringWrapper mb={2}>
        <CenteringWrapper mr={2}>
          <AppButton
            height={44}
            width={98}
            fontWeight={700}
            type="button"
            transparent
            onClick={close}>
            Cancel
          </AppButton>
        </CenteringWrapper>
        <AppButton
          height={44}
          width={isUpdateText ? 140 : 98}
          fontWeight={700}
          type="button"
          onClick={() => {
            onValidate();
            close();
          }}
          background="#0088CC">
          {isUpdateText ? "Update Metadata" : "Deploy"}
        </AppButton>
      </CenteringWrapper>
    </Popup>
  );
};
