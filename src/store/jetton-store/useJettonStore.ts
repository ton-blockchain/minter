import { useTonAddress } from "@tonconnect/ui-react";
import QuestiomMarkImg from "assets/icons/question.png";
import { useJettonAddress } from "hooks/useJettonAddress";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { resolveJettonDecimals, resolveJettonMetadataUri } from "lib/jetton-minter";
import { zeroAddress } from "lib/utils";
import { useCallback } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Address } from "ton";
import { isValidAddress } from "utils";
import { jettonStateAtom } from ".";
import { useNetwork } from "lib/hooks/useNetwork";
import { formatAddress, setSearchParam } from "lib/network";
import { useSearchParams } from "react-router-dom";

let latestRequest = 0;

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);
  const { showNotification } = useNotification();
  const connectedWalletAddress = useTonAddress();
  const { jettonAddress } = useJettonAddress();
  const { network } = useNetwork();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedWalletAddress = searchParams.get("address");

  const invalidateJettonDetails = useCallback(() => {
    latestRequest++;
    reset();
  }, [reset]);

  const getJettonDetails = useCallback(async () => {
    const requestId = ++latestRequest;

    let queryAddress = selectedWalletAddress;

    if (queryAddress && !isValidAddress(queryAddress)) {
      setSearchParams(setSearchParam(searchParams, "address"), { replace: true });
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

    reset();

    if (!jettonAddress || !isValidAddress(jettonAddress)) {
      showNotification("Invalid jetton address", "error");
      return true;
    }

    const parsedJettonMaster = Address.parse(jettonAddress);

    try {
      setState((prevState) => ({
        ...prevState,
        jettonLoading: true,
      }));

      const result = await jettonDeployController.getJettonDetails(
        parsedJettonMaster,
        address ?? zeroAddress(),
        network,
      );

      if (!result) {
        console.log("empty");

        return true;
      }
      const adminAddress = result.minter.admin ?? zeroAddress();
      const admin = (isMyWallet && userAddress && adminAddress.equals(userAddress)) || false;

      if (requestId !== latestRequest) return false;
      if (result.minter.metadataError) {
        showNotification(
          "On-chain data loaded, but token metadata could not be loaded.",
          "warning",
          undefined,
          5000,
        );
      }

      const decimals = resolveJettonDecimals(
        result.minter.metadata.decimals,
        result.minter.metadataError,
      );
      const validDecimals =
        decimals !== undefined &&
        /^\d+$/.test(decimals) &&
        Number(decimals) >= 0 &&
        Number(decimals) <= 255;
      if (decimals === undefined) {
        showNotification(
          "Token decimals are unavailable; amount operations are disabled",
          "warning",
        );
      } else if (!validDecimals) {
        showNotification(
          "Token metadata contains invalid decimals; amount operations are disabled",
          "error",
        );
      }

      let image: string | undefined;

      if (result.minter.metadata.image) {
        const img = new Image();
        const imageUrl = resolveJettonMetadataUri(result.minter.metadata.image);
        img.src = imageUrl;
        img.onerror = () => {
          if (requestId === latestRequest) {
            setState((prev) => ({ ...prev, isImageBroken: true }));
          }
        };

        image = imageUrl;
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
            type = "jpeg"; // Fallback
          }

          image = `data:image/${type};base64,${result.minter.metadata.image_data}`;
        } catch (e) {
          console.error("Error parsing img metadata");
        }
      }

      if (requestId !== latestRequest) {
        return false;
      }
      setState((prevState) => {
        return {
          ...prevState,
          isJettonDeployerFaultyOnChainData: result.minter.isJettonDeployerFaultyOnChainData,
          persistenceType: result.minter.persistenceType,
          description: result.minter.metadata.description,
          jettonImage: image ?? QuestiomMarkImg,
          rawJettonImage: result.minter.metadata.image,
          rawJettonImageData: result.minter.metadata.image_data,
          metadataError: result.minter.metadataError,
          totalSupply: result.minter.totalSupply,
          name: result.minter.metadata.name,
          symbol: result.minter.metadata.symbol,
          adminRevokedOwnership: zeroAddress().equals(adminAddress),
          isAdmin: admin,
          decimals: validDecimals ? decimals : undefined,
          adminAddress: formatAddress(adminAddress, network, false),
          balance: result.jettonWallet ? result.jettonWallet.balance : undefined,
          jettonWalletAddress: result.jettonWallet
            ? formatAddress(result.jettonWallet.jWalletAddress, network)
            : undefined,
          jettonMaster: jettonAddress,
          isMyWallet,
          selectedWalletAddress: address ? formatAddress(address, network, false) : undefined,
        };
      });
      return true;
    } catch (error) {
      if (requestId !== latestRequest) return false;
      if (error instanceof Error) {
        console.error(error);
        showNotification(
          !!error.message.match(/exit_code: (11|32)/g)
            ? `Unable to query. This is probably not a Jetton Contract (${error.message})`
            : error.message,
          "error",
        );
      }
      return true;
    } finally {
      if (requestId === latestRequest) {
        setState((prevState) => ({
          ...prevState,
          jettonLoading: false,
        }));
      }
    }
  }, [
    setState,
    showNotification,
    connectedWalletAddress,
    jettonAddress,
    network,
    reset,
    searchParams,
    selectedWalletAddress,
    setSearchParams,
  ]);

  return {
    ...state,
    getJettonDetails,
    invalidateJettonDetails,
    reset,
  };
}

export default useJettonStore;
