import {
  TonConnection,
  ChromeExtensionWalletProvider,
} from '@ton-defi.org/ton-connection';
import { jettonDeployController } from 'lib/deploy-controller';
import { EnvProfiles, Environments } from 'lib/env-profiles';
import { zeroAddress } from 'lib/utils';
import { useRecoilState, useResetRecoilState } from 'recoil';
import WalletConnection from 'services/wallet-connection';
import { Address, fromNano } from 'ton';
import { jettonStateAtom } from '.';
import QuestiomMarkImg from 'assets/question.png';
import { useCallback } from 'react';
import useNotification from 'hooks/useNotification';
import { useParams } from 'react-router-dom';
import useConnectionStore from 'store/connection-store/useConnectionStore';
import { getUrlParam, isValidAddress } from 'utils';

function useJettonStore() {
  const [state, setState] = useRecoilState(jettonStateAtom);
  const reset = useResetRecoilState(jettonStateAtom);
  const { showNotification } = useNotification();
  const { address: connectedWalletAddress, disconnect } = useConnectionStore();

  const { id }: { id?: string } = useParams();

  const getJettonDetails = useCallback(async () => {
    let queryAddress = getUrlParam('address');

    if (queryAddress && !isValidAddress(queryAddress)) {
      window.history.replaceState(null, '', window.location.pathname);
      queryAddress = null;
      showNotification(
        'Invalid jetton address in query param',
        'error',
        undefined,
        5000,
      );
    }
    if (queryAddress) {
      disconnect();
    }

    const address = queryAddress || connectedWalletAddress;
    const isMyWallet = address ? address === connectedWalletAddress : false;

    reset();

    if (!id || !isValidAddress(id)) {
      showNotification('Invalid jetton address', 'error');
      return;
    }

    const parsedJettonMaster = Address.parse(id);

    let connection;

    try {
      connection = WalletConnection.getConnection();
    } catch (error) {
      connection = new TonConnection(
        new ChromeExtensionWalletProvider(),
        EnvProfiles[Environments.MAINNET].rpcApi,
      );
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
        console.log('empty');

        return;
      }
      const _adminAddress = result.minter.admin.toFriendly();
      const admin = isMyWallet && _adminAddress === connectedWalletAddress;

      console.log({ result });

      setState((prevState) => {
        return {
          ...prevState,
          isJettonDeployerFaultyOnChainData:
            result.minter.isJettonDeployerFaultyOnChainData,
          persistenceType: result.minter.persistenceType,
          description: result.minter.metadata.description,
          jettonImage: result.minter.metadata.image || QuestiomMarkImg,
          totalSupply: fromNano(result.minter.totalSupply),
          name: result.minter.metadata.name,
          symbol: result.minter.metadata.symbol,
          adminRevokedOwnership: _adminAddress === zeroAddress().toFriendly(),
          isAdmin: admin,
          adminAddress: _adminAddress,
          balance: result.jettonWallet
            ? fromNano(result.jettonWallet.balance)
            : undefined,
          jettonAddress: result.jettonWallet?.jWalletAddress.toFriendly(),
          jettonMaster: id,
          isMyWallet,
          selectedWalletAddress: address,
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      }
    } finally {
      setState((prevState) => ({
        ...prevState,
        jettonLoading: false,
      }));
    }
  }, [setState, showNotification, connectedWalletAddress, id, reset]);

  return {
    ...state,
    getJettonDetails,
    reset,
  };
}

export default useJettonStore;
