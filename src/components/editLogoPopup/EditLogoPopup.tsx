import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import linkIcon from "assets/icons/link-icon.svg";
import { AppButton } from "components/appButton";
import { Popup } from "components/Popup";
import openLink from "assets/icons/link-open.svg";
import { useAutosizeTextArea } from "hooks/useAutoResizeTextArea";
import {
  LogoTextArea,
  LogoTextAreaWrapper,
  PopupContent,
  PopupDescription,
  PopupLink,
  PopupTitle,
} from "components/editLogoPopup/styled";
import { useJettonLogo } from "hooks/useJettonLogo";

interface EditLogoPopupProps {
  showPopup: boolean;
  tokenImage: any;
  close: () => void;
}

export const EditLogoPopup = ({ showPopup, tokenImage, close }: EditLogoPopupProps) => {
  const { jettonLogo, setLogoUrl, setTempUrl } = useJettonLogo();
  const [inputFocus, setInputFocus] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, jettonLogo.tempUrl);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setTempUrl(val);
  };

  useEffect(() => {
    setTempUrl(jettonLogo.logoUrl);
  }, [showPopup]);

  return (
    <Popup open={showPopup} onClose={close} maxWidth={644}>
      <PopupTitle>Edit logo</PopupTitle>
      <Box sx={{ width: "100%" }}>
        <PopupContent>
          {!inputFocus && !jettonLogo.tempUrl && (
            <img alt="Link icon" src={linkIcon} style={{ position: "absolute", left: 25 }} />
          )}
          <LogoTextAreaWrapper>
            <LogoTextArea
              spellCheck={false}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              value={jettonLogo.tempUrl}
              onChange={handleChange}
              ref={textAreaRef}
              rows={1}
            />
          </LogoTextAreaWrapper>
        </PopupContent>
        <PopupDescription>{tokenImage.description}</PopupDescription>
        <Box mx={2} mt={!jettonLogo.tempUrl ? 0 : 1}>
          <PopupLink
            href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices"
            target="_blank">
            Best practices for storing logo
            <img alt="Open icon" src={openLink} width={11} height={11} style={{ marginLeft: 4 }} />
          </PopupLink>
        </Box>
        <Box>
          <AppButton
            disabled={!jettonLogo.tempUrl}
            height={44}
            width={118}
            fontWeight={700}
            type="button"
            onClick={() => {
              setLogoUrl(jettonLogo.tempUrl);
              close();
            }}
            background="#0088CC">
            Save URL
          </AppButton>
        </Box>
      </Box>
    </Popup>
  );
};
