import { Box, styled, TextField, Typography } from '@mui/material';
import BN from 'bn.js';
import BaseButton from 'components/BaseButton';
import BigNumberDisplay from 'components/BigNumberDisplay';
import NumberInput from 'components/NumberInput';
import TxLoader from 'components/TxLoader';
import useNotification from 'hooks/useNotification';
import { jettonDeployController } from 'lib/deploy-controller';
import { useState } from 'react';
import WalletConnection from 'services/wallet-connection';
import useConnectionStore from 'store/connection-store/useConnectionStore';
import useJettonStore from 'store/jetton-store/useJettonStore';
import { StyledInput } from 'styles/styles';
import { Address, toNano } from 'ton';
import { isValidAddress } from 'utils';
import { StyledSectionTitle } from '../Row';

const getError = (
  toAddress?: string,
  amount?: number,
  balance?: string,
  symbol?: string,
): string | undefined | JSX.Element => {
  if (!toAddress) {
    return 'Recipient wallet address required';
  }

  if (toAddress && !isValidAddress(toAddress)) {
    return 'Invalid Recipient wallet address';
  }

  if (!amount) {
    return 'Transfer amount required';
  }

  if (toNano(amount).gt(toNano(balance!!))) {
    return (
      <>
        Maximum amount to transfer is <BigNumberDisplay value={balance!!} />{' '}
        {symbol}
      </>
    );
  }
};

function TransferAction() {
  const { balance, symbol, jettonAddress, getJettonDetails, isMyWallet } =
    useJettonStore();
  const [isLoading, setIsLoading] = useState(false);
  const [toAddress, setToAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { showNotification } = useNotification();
  const { address: connectedWalletAddress } = useConnectionStore();

  if (!balance || !jettonAddress || !isMyWallet) {
    return null;
  }

  const onSubmit = async () => {
    const error = getError(toAddress, amount, balance, symbol);
    if (error) {
      showNotification(error, 'warning', undefined, 3000);
      return;
    }

    setIsLoading(true);
    try {
      const connection = WalletConnection.getConnection();
      await jettonDeployController.transfer(
        connection,
        toNano(amount!),
        toAddress!,
        connectedWalletAddress!,
        jettonAddress,
      );
      setToAddress(undefined);
      setAmount(undefined);
      getJettonDetails();
      showNotification(
        `Successfully transfered ${amount?.toLocaleString()} ${symbol}`,
        'warning',
        undefined,
        4000,
      );
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <TxLoader open={isLoading}>
        <Typography>Transfer in progress...</Typography>
      </TxLoader>
      <StyledSectionTitle>Transfer {symbol}</StyledSectionTitle>
      <StyledInputs>
        <StyledInput>
          <TextField
            fullWidth
            label="Recipient wallet address"
            onChange={(e) => setToAddress(e.target.value)}
            value={toAddress || ''}
          />
        </StyledInput>
        <NumberInput
          label="Amount to transfer"
          onChange={(value: number) => setAmount(value)}
          value={amount}
        />
      </StyledInputs>
      <BaseButton onClick={onSubmit}>Transfer</BaseButton>
    </StyledContainer>
  );
}

export default TransferAction;

const StyledContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',

  '& .base-button': {
    height: 40,
    maxWidth: 200,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
});

const StyledInputs = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
});
