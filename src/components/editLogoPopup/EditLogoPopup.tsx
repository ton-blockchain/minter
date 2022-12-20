import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
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
  showExample?: boolean;
}

export const EditLogoPopup = ({
  showPopup,
  tokenImage,
  showExample,
  close,
}: EditLogoPopupProps) => {
  const { jettonLogo, setLogoUrl } = useJettonLogo();
  const [tempUrl, setTempUrl] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, tempUrl);

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
          <LogoTextAreaWrapper>
            <LogoTextArea
              spellCheck={false}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              value={tempUrl}
              onChange={handleChange}
              ref={textAreaRef}
              rows={1}
            />
          </LogoTextAreaWrapper>
        </PopupContent>
        <PopupDescription>
          {tokenImage.description}{" "}
          {showExample && (
            <span
              onClick={() => setTempUrl("https://bitcoincash-example.github.io/website/logo.png")}
              style={{ fontWeight: 700, cursor: "pointer" }}>
              example
            </span>
          )}
        </PopupDescription>
        <Box mx={2} mt={!tempUrl ? 0 : 1} sx={{ display: "inline-flex" }}>
          <PopupLink
            href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices"
            target="_blank">
            Best practices for storing logo
            <img alt="Open icon" src={openLink} width={11} height={11} style={{ marginLeft: 4 }} />
          </PopupLink>
        </Box>
        <Box>
          <AppButton
            disabled={!tempUrl}
            height={44}
            width={118}
            fontWeight={700}
            type="button"
            onClick={() => {
              setLogoUrl(tempUrl);
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
