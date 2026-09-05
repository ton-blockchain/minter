import { Typography } from "@mui/material";
import BigNumberDisplay from "components/BigNumberDisplay";
import { Popup } from "components/Popup";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { AppNumberInput } from "components/appInput";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "ton";
import BN from "bn.js";
import { useNetwork } from "lib/hooks/useNetwork";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "./jettonActions";
import { hasSufficientTokenBalance, parsePositiveTokenAmount } from "lib/amount";

function BurnJettonsAction() {
  const [amount, setAmount] = useState<string>("");
  const [open, setOpen] = useState(false);
  const {
    jettonMaster,
    symbol,
    getJettonDetails,
    balance,
    jettonWalletAddress,
    isMyWallet,
    decimals,
  } = useJettonStore();
  const { showNotification } = useNotification();
  const [actionInProgress, setActionInProgress] = useRecoilState(jettonActionsState);
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const { network } = useNetwork();
  if (!balance || !isMyWallet || !decimals) {
    return null;
  }

  const onBurn = async () => {
    if (!jettonMaster) {
      return;
    }

    if (!amount) {
      showNotification(`Minimum amount to burn is 1 ${symbol}`, "warning");
      return;
    }

    let valueDecimals: BN;
    try {
      valueDecimals = parsePositiveTokenAmount(amount, decimals, "Burn");
    } catch (error) {
      showNotification(error instanceof Error ? error.message : "Invalid burn amount", "warning");
      return;
    }
    if (!hasSufficientTokenBalance(valueDecimals, balance)) {
      const msg = (
        <>
          Maximum amount to burn is <BigNumberDisplay value={balance} decimals={decimals} />{" "}
          {symbol}
        </>
      );
      showNotification(msg, "warning", undefined, 3000);
      return;
    }

    try {
      setActionInProgress(true);
      const outcome = await jettonDeployController.burnJettons(
        tonConnectUI,
        Address.parse(jettonMaster),
        valueDecimals,
        jettonWalletAddress!,
        walletAddress,
        network,
      );
      if (!(await getJettonDetails())) return;
      showNotification(
        outcome.status === "confirmed"
          ? `Successfully burned ${amount} ${symbol}`
          : "Burn transaction was submitted, but final confirmation is still pending. Check the explorer before retrying.",
        outcome.status === "confirmed" ? "success" : "warning",
      );
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
      setOpen(false);
    }
  };

  const onClose = () => {
    setAmount("");
    setOpen(false);
  };

  return (
    <>
      <Popup open={open && !actionInProgress} onClose={onClose} maxWidth={400}>
        <>
          <Typography className="title">Burn {symbol}</Typography>
          <AppNumberInput label={`Enter ${symbol} amount`} value={amount} onChange={setAmount} />
          <AppButton onClick={onBurn}>Submit</AppButton>
        </>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={() => setOpen(true)}>
        Burn
      </AppButton>
    </>
  );
}

export default BurnJettonsAction;
