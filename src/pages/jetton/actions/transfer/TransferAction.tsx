import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { validateTransfer } from "./utils";
import { ButtonWrapper, TransferContent, TransferWrapper } from "./styled";
import { AppHeading } from "components/appHeading";
import { AppNumberInput, AppTextInput } from "components/appInput";
import { toDecimalsBN } from "utils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

export const TransferAction = () => {
  const { balance, symbol, jettonWalletAddress, getJettonDetails, isMyWallet, decimals } =
    useJettonStore();

  const [toAddress, setToAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { showNotification } = useNotification();
  const connectedWalletAddress = useTonAddress();
  const [tonconnect] = useTonConnectUI();
  const [actionInProgress, setActionInProgress] = useRecoilState(jettonActionsState);

  if (!balance || !jettonWalletAddress || !isMyWallet) {
    return null;
  }

  const onSubmit = async () => {
    const error = validateTransfer(
      toAddress,
      toDecimalsBN(amount!, decimals!),
      balance,
      symbol,
      decimals,
    );
    if (error) {
      showNotification(error, "warning", undefined, 3000);
      return;
    }

    setActionInProgress(true);
    try {
      await jettonDeployController.transfer(
        tonconnect,
        toDecimalsBN(amount!.toString(), decimals!),
        toAddress!,
        connectedWalletAddress!,
        jettonWalletAddress,
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
      setActionInProgress(false);
    }
  };

  return (
    <TransferWrapper>
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
        <AppButton
          disabled={!(toAddress && amount)}
          onClick={onSubmit}
          height={50}
          loading={actionInProgress}>
          Transfer {symbol}
        </AppButton>
      </ButtonWrapper>
    </TransferWrapper>
  );
};
