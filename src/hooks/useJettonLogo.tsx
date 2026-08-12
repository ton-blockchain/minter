import { useCallback, useEffect, useRef } from "react";
import coinLogo from "assets/icons/coin-logo.svg";
import { atom, useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import useJettonStore from "store/jetton-store/useJettonStore";
import brokenImage from "assets/icons/question.png";
import { useJettonAddress } from "hooks/useJettonAddress";
import { resolveJettonMetadataUri } from "lib/jetton-minter";

const defaultState = {
  iconHover: false,
  logoUrl: "",
  sourceLogoUrl: "",
  image: coinLogo,
  sourceImage: coinLogo,
  isLoading: false,
  hasError: false,
  isDirty: false,
};

const jettonLogoState = atom({
  key: "jettonLogo",
  default: defaultState,
});

export const useResetJettonLogo = () => useResetRecoilState(jettonLogoState);

export const useResetJettonLogoOnPathChange = (pathname: string) => {
  const resetJettonLogo = useResetJettonLogo();

  useEffect(() => resetJettonLogo(), [pathname, resetJettonLogo]);
};

const discardLogoDraft = (state: typeof defaultState) => ({
  ...state,
  logoUrl: state.sourceLogoUrl,
  image: state.sourceImage,
  isLoading: false,
  hasError: false,
  isDirty: false,
});

export const useDiscardJettonLogoDraft = () => {
  const setJettonLogo = useSetRecoilState(jettonLogoState);

  return useCallback(() => setJettonLogo(discardLogoDraft), [setJettonLogo]);
};

export const useJettonLogo = () => {
  const [jettonLogo, setJettonLogo] = useRecoilState(jettonLogoState);
  const { jettonImage, rawJettonImage, jettonMaster } = useJettonStore();
  const { jettonAddress } = useJettonAddress();
  const imageRequest = useRef(0);

  const resetJetton = () => setJettonLogo(defaultState);

  const discardDraft = () => setJettonLogo(discardLogoDraft);

  const setLogoUrl = (val: string) =>
    setJettonLogo((prev) => {
      return {
        ...prev,
        logoUrl: val,
        isDirty: val !== prev.sourceLogoUrl,
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

  useEffect(() => {
    const request = ++imageRequest.current;
    setHasError(false);
    if (!jettonLogo.logoUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const imageUrl = resolveJettonMetadataUri(jettonLogo.logoUrl);
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (request !== imageRequest.current) return;
      setIsLoading(false);
      setImage(imageUrl);
    };
    image.onerror = () => {
      if (request !== imageRequest.current) return;
      setHasError(true);
      setIsLoading(false);
      setImage(brokenImage);
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jettonLogo.logoUrl]);

  useEffect(() => {
    if (!jettonAddress) return;

    if (jettonMaster !== jettonAddress || !jettonImage) return;

    const sourceLogoUrl = rawJettonImage ?? "";
    setJettonLogo((prev) => {
      const preserveDraft = prev.isDirty && prev.logoUrl !== sourceLogoUrl;

      return {
        ...prev,
        sourceLogoUrl,
        sourceImage: jettonImage,
        isDirty: preserveDraft,
        ...(preserveDraft
          ? {}
          : {
              logoUrl: sourceLogoUrl,
              image: jettonImage,
              isLoading: false,
              hasError: false,
            }),
      };
    });
  }, [jettonAddress, jettonImage, jettonMaster, rawJettonImage, setJettonLogo]);

  return { jettonLogo, setLogoUrl, setIconHover, resetJetton, discardLogoDraft: discardDraft };
};
