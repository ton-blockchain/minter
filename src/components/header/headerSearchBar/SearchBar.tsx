import React, { useEffect } from "react";
import SearchImg from "assets/icons/search.svg";
import { IndentlessIcon, SearchBarInput, SearchBarWrapper } from "./styled";
import close from "assets/icons/close.svg";
import { Box, IconButton } from "@mui/material";
import { AppButton } from "components/appButton";
import { HeaderSearchResults } from "components/header/headerSearchResults";
import { useAddressHistory } from "hooks/useAddressHistory";

interface SearchBarProps {
  closeMenu?: () => void;
  resetExample?: () => void;
  example?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ example, resetExample, closeMenu }) => {
  const {
    addresses,
    onAddressClick,
    resetAddresses,
    removeAddress,
    onSubmit,
    setActive,
    setValue,
    addressInput,
  } = useAddressHistory();

  const onAddressRemove = (e: any, address: string) => {
    e.stopPropagation();
    removeAddress(address);
  };

  useEffect(() => {
    resetExample?.();
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        event.target.blur();
        onSubmit(addressInput.value.trim());
        closeMenu?.();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [addressInput.value, onSubmit]);

  useEffect(() => {
    example && setValue(example);
  }, [example]);

  return (
    <>
      {addressInput.active && (
        <Box
          onClick={() => setActive(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99998,
          }}
        />
      )}

      <Box sx={{ position: "relative", zIndex: addressInput.active ? 99999 : 3 }}>
        <SearchBarWrapper>
          <IndentlessIcon>
            <img src={SearchImg} width={18} height={18} alt="Search Icon" />
          </IndentlessIcon>
          <SearchBarInput
            placeholder="Jetton address"
            onPaste={(e: any) => setValue(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
            value={addressInput.value}
            onFocus={() => addresses?.length && setActive(true)}
            spellCheck={false}
          />
          {!!addressInput.value.length && (
            <>
              <IconButton onClick={() => setValue("")}>
                <img src={close} alt="Close Icon" width={18} height={18} />
              </IconButton>
              <AppButton
                height={34}
                width={40}
                onClick={() => {
                  onSubmit(addressInput.value.trim());
                  closeMenu?.();
                }}>
                Go
              </AppButton>
            </>
          )}
          {addressInput.active && !addressInput.value.length && (
            <IconButton onClick={() => setActive(false)}>
              <img src={close} alt="Close" width={18} height={18} />
            </IconButton>
          )}
        </SearchBarWrapper>

        {addressInput.active && !!addresses?.length && (
          <HeaderSearchResults
            searchResults={addresses}
            onHistoryClear={resetAddresses}
            onItemClick={onAddressClick}
            onItemDelete={onAddressRemove}
          />
        )}
      </Box>
    </>
  );
};
