import { useEffect } from "react";
import coinLogoHover from "assets/icons/coin-logo-hover.svg";
import coinLogo from "assets/icons/coin-logo.svg";
import { atom, useRecoilState } from "recoil";
import jet from "assets/icons/logo.svg";

const jettonLogoState = atom({
  key: "jettonLogo",
  default: {
    iconHover: false,
    logoUrl: "",
    imageValidationError: false,
    image: "",
    tempUrl: "",
  },
});

export const useJettonLogo = () => {
  const [jettonLogo, setJettonLogo] = useRecoilState(jettonLogoState);

  const setLogoUrl = (val: string) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        logoUrl: val,
      };
    });

  const setTempUrl = (val: string) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        tempUrl: val,
      };
    });

  const setImage = (val: string) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        image: val,
      };
    });

  const setIconHover = (val: boolean) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        iconHover: val,
      };
    });

  const setImageValidationError = (val: boolean) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        imageValidationError: val,
      };
    });

  useEffect(() => {
    if (jettonLogo.iconHover) {
      setImage(coinLogoHover);
    } else if (jettonLogo.logoUrl && !jettonLogo.imageValidationError) {
      setImage(jettonLogo.logoUrl);
    } else if (jettonLogo.imageValidationError) {
      setImage(jet);
    } else {
      setImage(coinLogo);
    }
  }, [jettonLogo.iconHover, jettonLogo.logoUrl, jettonLogo.imageValidationError]);

  useEffect(() => {
    setImageValidationError(false);
  }, [jettonLogo.logoUrl]);

  return { jettonLogo, setLogoUrl, setImageValidationError, setIconHover, setTempUrl };
};
