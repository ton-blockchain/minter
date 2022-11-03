import { Typography } from "@mui/material";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useConnectionStore from "store/connection-store/useConnectionStore";
import useJettonStore from "store/jetton-store/useJettonStore";
import { toNano } from "ton";
import { AppButton } from "components/appButton";
import { getError } from "./utils";
import { ButtonWrapper, TransferContent, TransferWrapper } from "./styled";
import { AppHeading } from "components/appHeading";
import { AppNumberInput, AppTextInput } from "components/appInput";

export const TransferAction = () => {
  const { balance, symbol, jettonAddress, getJettonDetails, isMyWallet } = useJettonStore();
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
      showNotification(error, "warning", undefined, 3000);
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
        "warning",
        undefined,
        4000,
      );
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransferWrapper>
      <TxLoader open={isLoading}>
        <Typography>Transfer in progress...</Typography>
      </TxLoader>
      <AppHeading
        text={`Transfer ${symbol}`}
        variant="h4"
        fontWeight={800}
        fontSize={20}
        marginBottom={20}
        color="#161C28"
      />
      <TransferContent>
        <AppTextInput
          fullWidth
          label="Recipient wallet address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <AppNumberInput
          label="Amount to transfer"
          onChange={(value: number) => setAmount(value)}
          value={amount}
        />
      </TransferContent>
      <ButtonWrapper>
        <AppButton disabled={!(toAddress && amount)} onClick={onSubmit} height={50}>
          Transfer SHH
        </AppButton>
      </ButtonWrapper>
    </TransferWrapper>
  );
};
