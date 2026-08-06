import { useEffect } from "react";
import coinLogo from "assets/icons/coin-logo.svg";
import { atom, useRecoilState } from "recoil";
import useJettonStore from "store/jetton-store/useJettonStore";
import brokenImage from "assets/icons/question.png";
import { useJettonAddress } from "hooks/useJettonAddress";
import { resolveJettonMetadataUri } from "lib/jetton-minter";

const defaultState = {
  iconHover: false,
  logoUrl: "",
  image: coinLogo,
  isLoading: false,
  hasError: false,
};

const jettonLogoState = atom({
  key: "jettonLogo",
  default: defaultState,
});

export const useJettonLogo = () => {
  const [jettonLogo, setJettonLogo] = useRecoilState(jettonLogoState);
  const { jettonImage, rawJettonImage } = useJettonStore();
  const { jettonAddress } = useJettonAddress();

  const resetJetton = () => setJettonLogo(defaultState);

  const setLogoUrl = (val: string) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        logoUrl: val,
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

  const setIsLoading = (val: boolean) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        isLoading: val,
      };
    });

  const setHasError = (val: boolean) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        hasError: val,
      };
    });

  const fetchImage = (url: string) => {
    const imageUrl = resolveJettonMetadataUri(url);
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setIsLoading(false);
      setImage(imageUrl);
    };
    image.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      setImage(brokenImage);
    };
  };

  useEffect(() => {
    setHasError(false);
    if (!jettonLogo.logoUrl) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchImage(jettonLogo.logoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jettonLogo.logoUrl]);

  useEffect(() => {
    if (jettonAddress) {
      setLogoUrl(rawJettonImage ?? "");
      if (!rawJettonImage && jettonImage) setImage(jettonImage);
    } else {
      resetJetton();
    }
    return () => resetJetton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jettonAddress, jettonImage, rawJettonImage]);

  return { jettonLogo, setLogoUrl, setIconHover, resetJetton };
};
