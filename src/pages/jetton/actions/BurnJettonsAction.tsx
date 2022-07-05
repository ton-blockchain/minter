import { Typography } from "@mui/material";
import BaseButton from "components/BaseButton";
import NumberInput from "components/NumberInput";
import { Popup } from "components/Popup";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { toNano } from "ton";

function BurnJettonsAction() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { jettonMaster, symbol, getJettonDetails, balance, jettonAddress, isMyWallet } =
    useJettonStore();
  const { showNotification } = useNotification();

  if (!balance || !isMyWallet) {
    return null;
  }

  const onBurn = async () => {
    if (!jettonMaster) {
      return;
    }

    if(!amount || amount === 0) {
      showNotification(`Minimum amount to burn is 1 ${symbol}`, "warning");
      return 
  }


    const value = toNano(amount);

    if(amount > balance){
      showNotification(`Maximum amount to burn is ${balance.toLocaleString()}`, "warning", undefined, 3000);
      return 
    }    

    try {
      setIsLoading(true);
      const connection = WalletConnection.getConnection();
      await jettonDeployController.burnJettons(connection, value, jettonAddress!);
      setOpen(false);
      const message = `Successfully burned ${amount.toLocaleString()} ${symbol}`;
      showNotification(message, "success");
      getJettonDetails();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setAmount(0);
    setOpen(false);
  };

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Burning...</Typography>
      </TxLoader>
      <Popup open={open && !isLoading} onClose={onClose} maxWidth={400}>
        <>
          <Typography className="title">Burn {symbol}</Typography>
          <NumberInput
            label={`Enter ${symbol} amount`}
            value={amount}
            onChange={(value: number) => setAmount(value)}
          />
          <BaseButton
            onClick={onBurn}
          >
            Submit
          </BaseButton>
        </>
      </Popup>
      <BaseButton transparent={true} onClick={() => setOpen(true)}>Burn</BaseButton>
    </>
  );
}

export default BurnJettonsAction;
