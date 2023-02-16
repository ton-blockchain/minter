import React, { useCallback, useEffect, useState } from "react";
import { PopupTitle } from "components/editLogoPopup/styled";
import { Box, Typography } from "@mui/material";
import { SearchBarInput } from "components/header/headerSearchBar/styled";
import { AppButton } from "components/appButton";
import { Popup } from "components/Popup";
import { isValidAddress } from "utils";
import { useSearchParams } from "react-router-dom";
import useNotification from "hooks/useNotification";
import useJettonStore from "store/jetton-store/useJettonStore";

interface CheckWalletBalancePopupProps {
  showPopup: boolean;
  close: () => void;
}

export const CheckWalletBalancePopup = ({ showPopup, close }: CheckWalletBalancePopupProps) => {
  const [search, setSearch] = useState<string>("");
  const [params, setParams] = useSearchParams();
  const { showNotification } = useNotification();
  const { getJettonDetails } = useJettonStore();

  const searchForWallet = useCallback(() => {
    if (isValidAddress(search)) {
      params.append("address", search);
      setParams(params);
      close();
      setSearch("");
    } else {
      showNotification("Wallet address in invalid", "error");
    }
  }, [search]);

  useEffect(() => {
    getJettonDetails();
  }, [params]);

  return (
    <Popup
      open={showPopup}
      onClose={() => {
        close();
        setSearch("");
      }}
      maxWidth={592}>
      <PopupTitle>Check balance for another address</PopupTitle>
      <Typography sx={{ alignSelf: "baseline" }} mb={1.5}>
        Enter address to check balance:
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "auto",
          padding: "0px 17px",
          width: "100%",
          minHeight: 50,
          height: "100%",
          transition: "0.1s all",
          background: "#F7F9FB",
          border: "0.5px solid rgba(114, 138, 150, 0.16)",
          borderRadius: 40,
        }}>
        <SearchBarInput
          placeholder="Jetton address"
          onPaste={(e: any) => setSearch(e.target.value)}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          spellCheck={false}
          onKeyDown={(e) => e.key === "Enter" && searchForWallet()}
        />
      </Box>
      <Box>
        <AppButton width={160} onClick={searchForWallet}>
          Check balance
        </AppButton>
      </Box>
    </Popup>
  );
};
