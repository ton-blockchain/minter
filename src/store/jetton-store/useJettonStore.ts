import {
  TonConnection,
  ChromeExtensionWalletProvider,
} from "@ton-defi.org/ton-connection";
import { jettonDeployController } from "lib/deploy-controller";
import { EnvProfiles, Environments } from "lib/env-profiles";
import { zeroAddress } from "lib/utils";
import { useRecoilState, useResetRecoilState } from "recoil";
import WalletConnection from "services/wallet-connection";
import { Address, fromNano } from "ton";
import { jettonStateAtom } from ".";
import QuestiomMarkImg from "assets/question.png";
import { useCallback } from "react";

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);

  const getJettonDetails = useCallback(
    async (jettonMaster: string, address?: string | null) => {
      setState((prevState) => {
        return {
          ...prevState,
          isLoading: true,
        };
      });

      let connection;

      try {
        connection = WalletConnection.getConnection();
      } catch (error) {
        connection = new TonConnection(
          new ChromeExtensionWalletProvider(),
          EnvProfiles[Environments.MAINNET].rpcApi
        );
      }

      try {
        const result = await jettonDeployController.getJettonDetails(
          Address.parse(jettonMaster),
          address ? Address.parse(address) : zeroAddress(),
          connection
        );

        if (!result) {
          console.log("empty");

          return;
        }
        const _adminAddress = result.minter.admin.toFriendly();
        const admin = _adminAddress === address;

          

        setState((prevState) => {
          return {
            ...prevState,
            isOnchain: result.minter.isOnchain,
            description: result.minter.metadata.description,
            jettonImage: result.minter.metadata.image || QuestiomMarkImg,
            totalSupply: parseFloat(fromNano(result.minter.totalSupply)).toLocaleString(),
            name: result.minter.metadata.name,
            symbol: result.minter.metadata.symbol,
            adminRevokedOwnership: _adminAddress === zeroAddress().toFriendly(),
            isAdmin: admin,
            adminAddress: _adminAddress,
            balance: result.jettonWallet
              ? fromNano(result.jettonWallet.balance)
              : undefined,
            jettonAddress: result.jettonWallet?.jWalletAddress.toFriendly(),
            jettonMaster
          };
        });
      } finally {
        setState((prevState) => {
          return {
            ...prevState,
            isLoading: false,
          };
        });
      }
    },
    [setState]
  );

  const revokeAdminOwnership = useCallback(
    async (contractAddr: string) => {
      await jettonDeployController.burnAdmin(
        Address.parse(contractAddr),
        WalletConnection.getConnection()
      );
      setState((prevState) => {
        return {
          ...prevState,
          isAdmin: false,
          adminRevokedOwnership: true,
          adminAddress: zeroAddress().toFriendly(),
        };
      });
    },
    [setState]
  );

  const stopLoading = useCallback(() => {
    setState((prevState) => {
      return {
        ...prevState,
        isLoading: false,
      };
    });
  }, [setState]);

  return {
    ...state,
    getJettonDetails,
    revokeAdminOwnership,
    stopLoading,
    reset,
  };
}

export default useJettonStore;
