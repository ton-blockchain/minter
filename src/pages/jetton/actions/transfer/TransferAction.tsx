import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { validateTransfer } from "./utils";
import { ButtonWrapper, TransferContent, TransferWrapper } from "./styled";
import { AppHeading } from "components/appHeading";
import { AppNumberInput, AppTextInput } from "components/appInput";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "ton";
import { useNetwork } from "lib/hooks/useNetwork";
import { parsePositiveTokenAmount } from "lib/amount";

export const TransferAction = () => {
  const {
    balance,
    symbol,
    jettonMaster,
    jettonWalletAddress,
    getJettonDetails,
    isMyWallet,
    decimals,
  } = useJettonStore();

  const [toAddress, setToAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string>("");
  const { showNotification } = useNotification();
  const connectedWalletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [actionInProgress, setActionInProgress] = useRecoilState(jettonActionsState);
  const { network } = useNetwork();

  if (!balance || !jettonMaster || !jettonWalletAddress || !isMyWallet || !decimals) {
    return null;
  }

  const onSubmit = async () => {
    let atomicAmount;
    try {
      atomicAmount = parsePositiveTokenAmount(amount, decimals!, "Transfer");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Invalid transfer amount",
        "warning",
      );
      return;
    }
    const error = validateTransfer(toAddress, atomicAmount, balance, symbol, decimals);
    if (error) {
      showNotification(error, "warning", undefined, 3000);
      return;
    }

    setActionInProgress(true);
    try {
      const outcome = await jettonDeployController.transfer(
        tonConnectUI,
        Address.parse(jettonMaster),
        atomicAmount,
        toAddress!,
        connectedWalletAddress!,
        jettonWalletAddress,
        network,
      );
      setToAddress(undefined);
      setAmount("");
      if (!(await getJettonDetails())) return;
      showNotification(
        outcome.status === "confirmed"
          ? `Successfully transferred ${amount} ${symbol}`
          : "Transfer transaction was submitted, but final confirmation is still pending. Check the explorer before retrying.",
        outcome.status === "confirmed" ? "success" : "warning",
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
        <AppNumberInput label="Amount to transfer" onChange={setAmount} value={amount} />
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
