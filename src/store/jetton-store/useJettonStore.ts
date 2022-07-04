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
      let connection;

      try {
        connection = WalletConnection.getConnection();
      } catch (error) {
        connection = new TonConnection(
          new ChromeExtensionWalletProvider(),
          EnvProfiles[Environments.MAINNET].rpcApi
        );
      }

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

      console.log(result);

      setState((prevState) => {
        return {
          ...prevState,
          isJettonDeployerFaultyOnChainData:
            result.minter.isJettonDeployerFaultyOnChainData,
          persistenceType: result.minter.persistenceType,
          description: result.minter.metadata.description,
          jettonImage: result.minter.metadata.image || QuestiomMarkImg,
          totalSupply: parseFloat(fromNano(result.minter.totalSupply)),
          name: result.minter.metadata.name,
          symbol: result.minter.metadata.symbol,
          adminRevokedOwnership: _adminAddress === zeroAddress().toFriendly(),
          isAdmin: admin,
          adminAddress: _adminAddress,
          balance: result.jettonWallet
            ? parseFloat(fromNano(result.jettonWallet.balance))
            : undefined,
          jettonAddress: result.jettonWallet?.jWalletAddress.toFriendly(),
          jettonMaster,
        };
      });
    },
    []
  );

  const fixFaultyDeploy = async () => {
    const connection = WalletConnection.getConnection();
    if (!connection) {
      throw new Error("Please connect wallet");
    }

    if (!state.jettonMaster) {
      throw new Error("Jetton address missing");
    }

    return jettonDeployController.fixFaultyJetton(
      Address.parse(state.jettonMaster),
      {
        symbol: state.symbol,
        name: state.name,
        description: state.description,
        image: state.jettonImage,
      },
      connection
    );
  };

  const onMintSuccess = (value: number) => {
    setState((prevState) => {
      return {
        ...prevState,
        balance: prevState.balance ? prevState.balance + value : undefined,
        totalSupply: prevState.totalSupply
          ? prevState.totalSupply + value
          : undefined,
      };
    });
  };

  const onTransferSuccess = (value: number) => {
    setState((prevState) => {
      return {
        ...prevState,
        balance: prevState.balance ? prevState.balance - value : undefined,
      };
    });
  };


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

  return {
    ...state,
    getJettonDetails,
    revokeAdminOwnership,
    reset,
    fixFaultyDeploy,
    onMintSuccess,
    onTransferSuccess
  };
}

export default useJettonStore;
