import { useTonAddress } from "@tonconnect/ui-react";
import QuestiomMarkImg from "assets/icons/question.png";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { zeroAddress } from "lib/utils";
import { useCallback } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Address } from "ton";
import { getUrlParam, isValidAddress } from "utils";
import { jettonStateAtom } from ".";

let i = 0;

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);
  const { showNotification } = useNotification();
  const connectedWalletAddress = useTonAddress();
  const { jettonAddress } = useJettonAddress();

  const getJettonDetails = useCallback(async () => {
    i++;
    const myIndex = i;

    const currentJettonAddress = jettonAddress;

    let queryAddress = getUrlParam("address");

    if (queryAddress && !isValidAddress(queryAddress)) {
      window.history.replaceState(null, "", window.location.pathname);
      queryAddress = null;
      showNotification("Invalid jetton address in query param", "error", undefined, 5000);
    }

    let address: Address | null = null;
    try {
      address = Address.parse(queryAddress || connectedWalletAddress);
    } catch (error) {}

    let userAddress: Address | null = null;
    try {
      userAddress = Address.parse(connectedWalletAddress);
    } catch (error) {}

    const isMyWallet = address && userAddress ? address.equals(userAddress) : false;

    if (!currentJettonAddress || !isValidAddress(currentJettonAddress)) {
      return;
    }

    reset();

    const parsedJettonMaster = Address.parse(currentJettonAddress);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;

        setState((prevState) => ({
          ...prevState,
          jettonLoading: true,
        }));

        const result = await jettonDeployController.getJettonDetails(
          parsedJettonMaster,
          address ?? zeroAddress(),
        );

        if (!result) {
          console.log("empty");
          return;
        }

        const _adminAddress = result.minter.admin?.toFriendly() ?? zeroAddress().toFriendly();
        const adminAddress = Address.parse(_adminAddress);
        const admin = (isMyWallet && userAddress && adminAddress.equals(userAddress)) || false;

        let image: string | undefined;

        if (result.minter.metadata.image) {
          const img = new Image();
          img.src = result.minter.metadata.image;
          img.onerror = () => {
            setState((prev) => ({ ...prev, isImageBroken: true }));
          };
          image = result.minter.metadata.image;
        } else if (result.minter.metadata.image_data) {
          try {
            const imgData = Buffer.from(result.minter.metadata.image_data, "base64").toString();
            let type: string;

            if (/<svg xmlns/.test(imgData)) {
              type = "svg+xml";
            } else if (/png/i.test(imgData)) {
              type = "png";
            } else {
              console.warn("Defaulting to jpeg");
              type = "jpeg";
            }

            image = `data:image/${type};base64,${result.minter.metadata.image_data}`;
          } catch (e) {
            console.error("Error parsing img metadata");
          }
        }

        if (myIndex !== i) {
          return;
        }

        setState((prevState) => {
          return {
            ...prevState,
            isJettonDeployerFaultyOnChainData: result.minter.isJettonDeployerFaultyOnChainData,
            persistenceType: result.minter.persistenceType,
            description: result.minter.metadata.description,
            jettonImage: image ?? QuestiomMarkImg,
            totalSupply: result.minter.totalSupply,
            name: result.minter.metadata.name,
            symbol: result.minter.metadata.symbol,
            adminRevokedOwnership: zeroAddress().equals(adminAddress),
            isAdmin: admin,
            decimals: result.minter.metadata.decimals || "9",
            adminAddress: adminAddress.toFriendly({ urlSafe: true, bounceable: false }),
            balance: result.jettonWallet ? result.jettonWallet.balance : undefined,
            jettonWalletAddress: result.jettonWallet?.jWalletAddress?.toFriendly(),
            jettonMaster: currentJettonAddress,
            isMyWallet,
            selectedWalletAddress: address?.toFriendly({ urlSafe: true, bounceable: false }),
          };
        });

        setState((prevState) => ({
          ...prevState,
          jettonLoading: false,
        }));

        return;
      } catch (error) {
        if (
          attempts < maxAttempts &&
          error instanceof Error &&
          (error.message.match(/exit_code: -13/g) || error.message.includes("502"))
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        if (error instanceof Error) {
          console.error(error);
          if (error.message.match(/exit_code: (11|32|-13)/g)) {
            showNotification(
              `Unable to load token data. Please try again. (Reload web site)`,
              "error",
            );
          } else if (error.message.includes("502")) {
            showNotification(`Server error. Please try again.`, "error");
          } else {
            showNotification(error.message, "error");
          }
        }

        setState((prevState) => ({
          ...prevState,
          jettonLoading: false,
        }));
      }
      break;
    }
  }, [setState, showNotification, connectedWalletAddress, jettonAddress, reset]);

  return {
    ...state,
    getJettonDetails,
    reset,
  };
}

export default useJettonStore;
