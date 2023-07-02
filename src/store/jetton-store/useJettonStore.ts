import { TonConnection, ChromeExtensionWalletProvider } from "@ton-defi.org/ton-connection";
import { JettonDeployParams, jettonDeployController } from "lib/deploy-controller";
import { createDeployParams, zeroAddress } from "lib/utils";
import { useRecoilState, useResetRecoilState } from "recoil";
import WalletConnection from "services/wallet-connection";
import { Address, Cell } from "ton";
import { jettonDeployController } from "lib/deploy-controller";
import { zeroAddress } from "lib/utils";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Address } from "ton";
import { jettonStateAtom } from ".";
import QuestiomMarkImg from "assets/icons/question.png";
import { useCallback } from "react";
import useNotification from "hooks/useNotification";
import { getUrlParam, isValidAddress } from "utils";
import { useJettonAddress } from "hooks/useJettonAddress";
import { JETTON_MINTER_CODE } from "lib/jetton-minter";
import BN from "bn.js";
import { ContractDeployer } from "lib/contract-deployer";
import {
  MIGRATION_HELPER_CODE,
  MIGRATION_MASTER_CODE,
  MigrationHelperConfig,
  MigrationMasterConfig,
  migrationHelperConfigToCell,
  migrationMasterConfigToCell,
} from "lib/migrations";
import { getClient } from "lib/get-ton-client";
import { useParams } from "react-router-dom";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);
  const { showNotification } = useNotification();
  const connectedWalletAddress = useTonAddress();
  const { jettonAddress } = useJettonAddress();
  const { migrationId }: { migrationId?: string } = useParams();

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

  const setMigrationHelperBalance = useCallback(
    (newValue: BN) => {
      setState((prevState) => ({
        ...prevState,
        migrationHelperBalance: newValue,
      }));
    },
    [setState],
  );

  const setMigrationHelperDeployed = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        isMigrationHelperDeployed: newValue,
      }));
    },
    [setState],
  );

  const setTransferredJettonsToHelper = useCallback(
    (newValue: boolean) => {
      setState((prevState) => ({
        ...prevState,
        transferredJettonsToHelper: newValue,
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

    try {
      setState((prevState) => ({
        ...prevState,
        jettonLoading: true,
      }));

      const result = await jettonDeployController.getJettonDetails(
        parsedJettonMaster,
        address ? Address.parse(address) : zeroAddress(),
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

        const client = await getClient();
        const isNewMinterDeployed = await client.isContractDeployed(newMinterAddress);
        let isMigrationMasterDeployed = false;
        let mintedJettonsToMaster = false;

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

          if (isMigrationMasterDeployed) {
            const result = await jettonDeployController.getJettonDetails(
              newMinterAddress,
              migrationMasterAddress,
              connection,
            );

            if (result) {
              const migrationMasterJettonBalance = result.jettonWallet?.balance;

              if (migrationMasterJettonBalance?.gt(new BN(0))) {
                mintedJettonsToMaster = true;
              }
            }
          }
        }

        let migrationHelperAddress: Address;
        let isMigrationHelperDeployed: boolean;
        let migrationHelperBalance: BN;

        if (migrationId) {
          const migrationHelperConfig: MigrationHelperConfig = {
            oldJettonMinter: parsedJettonMaster,
            migrationMaster: Address.parse(migrationId),
            recipient: Address.parse(address),
          };
          migrationHelperAddress = new ContractDeployer().addressForContract({
            code: MIGRATION_HELPER_CODE,
            data: await migrationHelperConfigToCell(migrationHelperConfig),
            deployer: Address.parse(address), //anything
            value: new BN(0), //anything
          });
          isMigrationHelperDeployed = await client.isContractDeployed(migrationHelperAddress);

          if (isMigrationHelperDeployed) {
            migrationHelperBalance = await client.getBalance(migrationHelperAddress);
          }
        }

        setState((prevState) => ({
          ...prevState,
          isNewMinterDeployed,
          newMinterAddress: newMinterAddress.toString(),
          isMigrationMasterDeployed,
          mintedJettonsToMaster,
          migrationHelper: migrationHelperAddress ? migrationHelperAddress.toString() : undefined,
          isMigrationHelperDeployed,
          migrationHelperBalance,
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
    migrationId,
    getJettonDetails,
    reset,
    setNewMinterDeployed,
    setMigrationMasterDeployed,
    setMintedJettonsToMaster,
    setMigrationStarted,
    setMigrationHelperDeployed,
    setMigrationHelperBalance,
    setTransferredJettonsToHelper,
  };
}

export default useJettonStore;
