import { TonConnection, ChromeExtensionWalletProvider } from "@ton-defi.org/ton-connection";
import { JettonDeployParams, jettonDeployController } from "lib/deploy-controller";
import { createDeployParams, zeroAddress } from "lib/utils";
import { useRecoilState, useResetRecoilState } from "recoil";
import WalletConnection from "services/wallet-connection";
import { Address, Cell } from "ton";
import { jettonStateAtom } from ".";
import QuestiomMarkImg from "assets/icons/question.png";
import { useCallback } from "react";
import useNotification from "hooks/useNotification";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { getUrlParam, isValidAddress } from "utils";
import { useJettonAddress } from "hooks/useJettonAddress";
import { JETTON_MINTER_CODE } from "lib/jetton-minter";
import { BN } from "bn.js";
import { ContractDeployer } from "lib/contract-deployer";
import {
  MIGRATION_MASTER_CODE,
  MigrationMasterConfig,
  migrationMasterConfigToCell,
} from "lib/migrations";
import { getClient } from "lib/get-ton-client";

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);
  const { showNotification } = useNotification();
  const { address: connectedWalletAddress } = useConnectionStore();
  const { jettonAddress } = useJettonAddress();

  const setNewMinterDeployed = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        isNewMinterDeployed: newValue,
      }));
    },
    [setState],
  );

  const setMigrationMasterDeployed = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        isMigrationMasterDeployed: newValue,
      }));
    },
    [setState],
  );

  const setMintedJettonsToMaster = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        mintedJettonsToMaster: newValue,
      }));
    },
    [setState],
  );

  const setMigrationStarted = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        migrationStarted: newValue,
      }));
    },
    [setState],
  );

  const getJettonDetails = useCallback(async () => {
    let queryAddress = getUrlParam("address");

    if (queryAddress && !isValidAddress(queryAddress)) {
      window.history.replaceState(null, "", window.location.pathname);
      queryAddress = null;
      showNotification("Invalid jetton address in query param", "error", undefined, 5000);
    }

    const address = queryAddress || connectedWalletAddress;
    const isMyWallet = address ? address === connectedWalletAddress : false;

    reset();

    if (!jettonAddress || !isValidAddress(jettonAddress)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    const parsedJettonMaster = Address.parse(jettonAddress);

    let connection;

    try {
      connection = WalletConnection.getConnection();
    } catch (error) {
      connection = new TonConnection(new ChromeExtensionWalletProvider());
    }

    try {
      setState((prevState) => ({
        ...prevState,
        jettonLoading: true,
      }));

      const result = await jettonDeployController.getJettonDetails(
        parsedJettonMaster,
        address ? Address.parse(address) : zeroAddress(),
        connection,
      );

      if (!result) {
        console.log("empty");

        return;
      }
      const _adminAddress = result.minter.admin.toFriendly();
      const admin = isMyWallet && _adminAddress === connectedWalletAddress;

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
            type = "jpeg"; // Fallback
          }

          image = `data:image/${type};base64,${result.minter.metadata.image_data}`;
        } catch (e) {
          console.error("Error parsing img metadata");
        }
      }

      const minterCode = Cell.fromBoc(
        await jettonDeployController.getJettonMinterCode(parsedJettonMaster),
      )[0];

      const name = result.minter.metadata.name;
      const symbol = result.minter.metadata.symbol;
      const jettonImage = image ?? QuestiomMarkImg;
      const description = result.minter.metadata.description;
      const decimals = result.minter.metadata.decimals || "9";

      setState((prevState) => {
        return {
          ...prevState,
          isJettonDeployerFaultyOnChainData: result.minter.isJettonDeployerFaultyOnChainData,
          persistenceType: result.minter.persistenceType,
          description,
          jettonImage,
          totalSupply: result.minter.totalSupply,
          name,
          symbol,
          adminRevokedOwnership: _adminAddress === zeroAddress().toFriendly(),
          isAdmin: admin,
          decimals,
          adminAddress: _adminAddress,
          balance: result.jettonWallet ? result.jettonWallet.balance : undefined,
          jettonWalletAddress: result.jettonWallet?.jWalletAddress.toFriendly(),
          jettonMaster: jettonAddress,
          isMyWallet,
          selectedWalletAddress: address,
          isCodeOld: !minterCode.equals(JETTON_MINTER_CODE),
        };
      });

      console.log(address);

      if (address) {
        const minterParams: JettonDeployParams = {
          owner: Address.parse(address),
          onchainMetaData: {
            name: name!,
            symbol: symbol!,
            image: jettonImage,
            description: description,
            decimals: parseInt(decimals!).toFixed(0),
          },
          amountToMint: new BN(0),
        };
        const minterDeployParams = createDeployParams(minterParams);
        const newMinterAddress = new ContractDeployer().addressForContract(minterDeployParams);
        console.log(newMinterAddress.toFriendly());
        const client = await getClient();
        const isNewMinterDeployed = await client.isContractDeployed(newMinterAddress);
        let isMigrationMasterDeployed = false;
        let mintedJettonsToMaster = false;

        console.log(isNewMinterDeployed);

        if (isNewMinterDeployed) {
          const migrationMasterConfig: MigrationMasterConfig = {
            oldJettonMinter: parsedJettonMaster,
            newJettonMinter: newMinterAddress,
          };
          const migrationMasterAddress = new ContractDeployer().addressForContract({
            code: MIGRATION_MASTER_CODE,
            data: await migrationMasterConfigToCell(migrationMasterConfig),
            deployer: Address.parse(address), //anything
            value: new BN(0), //anything
          });
          isMigrationMasterDeployed = await client.isContractDeployed(migrationMasterAddress);

          console.log(isMigrationMasterDeployed);

          if (isMigrationMasterDeployed) {
            const result = await jettonDeployController.getJettonDetails(
              newMinterAddress,
              migrationMasterAddress,
              connection,
            );

            if (!result) {
              console.log("empty");
              return;
            }

            console.log("qwe", result.jettonWallet?.jWalletAddress.toFriendly());

            const migrationMasterJettonBalance = result.jettonWallet?.balance;

            if (migrationMasterJettonBalance?.gt(new BN(0))) {
              mintedJettonsToMaster = true;
            }
          }
        }

        setState((prevState) => ({
          ...prevState,
          isNewMinterDeployed,
          newMinterAddress: newMinterAddress.toString(),
          isMigrationMasterDeployed,
          mintedJettonsToMaster,
        }));
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification(
          !!error.message.match(/exit_code: (11|32)/g)
            ? `Unable to query. This is probably not a Jetton Contract (${error.message})`
            : error.message,
          "error",
        );
      }
    } finally {
      setState((prevState) => ({
        ...prevState,
        jettonLoading: false,
      }));
    }
  }, [setState, showNotification, connectedWalletAddress, jettonAddress, reset]);

  return {
    ...state,
    getJettonDetails,
    reset,
    setNewMinterDeployed,
    setMigrationMasterDeployed,
    setMintedJettonsToMaster,
    setMigrationStarted,
  };
}

export default useJettonStore;
