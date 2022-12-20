import { useEffect } from "react";
import coinLogo from "assets/icons/coin-logo.svg";
import { atom, useRecoilState } from "recoil";
import useJettonStore from "store/jetton-store/useJettonStore";
import { useParams } from "react-router-dom";
import brokenImage from "assets/icons/question.png";

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
  const { jettonImage } = useJettonStore();
  const { id }: { id?: string } = useParams();

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
    const image = new Image();
    image.src = url;
    image.onload = () => {
      setIsLoading(false);
      setImage(url);
    };
    image.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      setImage(brokenImage);
    };
  };

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    jettonLogo.logoUrl && fetchImage(jettonLogo.logoUrl);
  }, [jettonLogo.logoUrl]);

  useEffect(() => {
    id ? jettonImage && setLogoUrl(jettonImage) : resetJetton();
    return () => resetJetton();
  }, [id]);

  return { jettonLogo, setLogoUrl, setIconHover, resetJetton };
};
