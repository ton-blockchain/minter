import { Box, styled, TextField, Typography } from "@mui/material";
import BaseButton from "components/BaseButton";
import NumberInput from "components/NumberInput";
import { Popup } from "components/Popup";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address, toNano } from "ton";

const getError = (
  toAddress?: string,
  amount?: number,
  balance?: number,
  symbol?: string
): string | undefined => {
  if (!toAddress) {
    return "Recipient wallet address required";
  }

  try {
    Address.parse(toAddress);
  } catch (error) {
    return "Invalid Recipient wallet address";
  }

  if (!amount) {
    return "Transfer amount required";
  }

  if (amount > balance!!) {
    return `Maximum amount to transfer is ${balance?.toLocaleString()} ${symbol}`;
  }
};

function TransferAction() {
  const { balance, symbol, onTransferSuccess, jettonAddress } = useJettonStore();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toAddress, setToAddress] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { showNotification } = useNotification();

  if (!balance || !jettonAddress) {
    return null;
  }

  const onSubmit = async () => {
    const error = getError(toAddress, amount, balance, symbol);
    if (error) {
      showNotification(error, "warning");
      return;
    }

    setIsLoading(true);
    try {
      const connection = WalletConnection.getConnection();
      await jettonDeployController.transfer(
        connection,
        toNano(amount!!),
        toAddress!!,
        jettonAddress
      );
      onTransferSuccess(amount!!);
      showNotification(
        `Successfully transfered ${amount?.toLocaleString()} ${symbol}`,
        "warning",
        undefined,
        4000
      );
      setOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onAddressChange = (value: string) => {
    setToAddress(value);
  };

  const onAmountChange = (value: number) => {
    setAmount(value);
  };


  const onClose = () => {
    setOpen(false)
    setToAddress(undefined)
    setAmount(undefined)
  }

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Transfer in progress...</Typography>
      </TxLoader>
      <Popup open={open && !isLoading} onClose={onClose} maxWidth={450}>
        <>
          <Typography className="title">Transfer {symbol}</Typography>
          <StyledInputs>
            <TextField
              fullWidth
              label="Recipient wallet address"
              onChange={(e) => onAddressChange(e.target.value)}
              value={toAddress || ""}
            />
            <NumberInput
              label="Amount to transfer"
              onChange={onAmountChange}
              value={amount}
            />
          </StyledInputs>
          <BaseButton onClick={onSubmit}>Submit</BaseButton>
        </>
      </Popup>
      <BaseButton loading={isLoading} onClick={() => setOpen(true)}>
        Transfer
      </BaseButton>
    </>
  );
}

export default TransferAction;

const StyledInputs = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 30,
});
