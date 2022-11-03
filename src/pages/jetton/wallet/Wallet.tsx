import React from "react";
import { AppHeading } from "components/appHeading";
import { StyledBlock, StyledCategoryFields } from "pages/jetton/styled";
import { DataRow } from "pages/jetton/dataRow";
import BigNumberDisplay from "components/BigNumberDisplay";
import { balanceActions } from "pages/jetton/util";
import { TransferAction } from "pages/jetton/actions/transfer";
import useJettonStore from "store/jetton-store/useJettonStore";
import ConnectAction from "pages/jetton/actions/ConnectAction";
import { Box } from "@mui/material";

export const Wallet = () => {
  const { balance, symbol, jettonLoading, selectedWalletAddress } = useJettonStore();
  return (
    <StyledBlock>
      <AppHeading
        text="Connected Jetton wallet"
        variant="h4"
        fontWeight={800}
        fontSize={20}
        marginBottom={20}
        color="#161C28"
      />
      <StyledCategoryFields>
        <DataRow
          title="Wallet Address"
          value={selectedWalletAddress}
          dataLoading={jettonLoading}
          address={selectedWalletAddress}
          description="Connected wallet public address, can be shared to receive jetton transfers"
        />
        <DataRow
          title="Wallet Balance"
          value={
            balance && (
              <>
                <BigNumberDisplay value={balance} /> {symbol}
              </>
            )
          }
          dataLoading={jettonLoading}
          actions={balanceActions}
          description="Number of tokens in connected wallet that can be transferred to others"
        />
        <TransferAction />
      </StyledCategoryFields>
      {!selectedWalletAddress && !jettonLoading && (
        <Box sx={{ height: 46, marginTop: 3 }}>
          <ConnectAction />
        </Box>
      )}
    </StyledBlock>
  );
};
