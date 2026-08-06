import React, { useEffect } from "react";
import SearchImg from "assets/icons/search.svg";
import { IndentlessIcon, SearchBarInput, SearchBarWrapper } from "./styled";
import close from "assets/icons/close.svg";
import { Backdrop, ClickAwayListener, IconButton } from "@mui/material";
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
    // The example is reset only when the search bar is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    example && setValue(example);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [example]);

  return (
    <ClickAwayListener onClickAway={() => setActive(false)}>
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: 2, overflow: "hidden" }}
          open={addressInput.active}
          onClick={() => setActive(false)}></Backdrop>
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit(addressInput.value);
                closeMenu?.();
              }
            }}
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
                  onSubmit(addressInput.value);
                  closeMenu?.();
                }}>
                Go
              </AppButton>
            </>
          )}
          {addressInput.active && !!addresses?.length && (
            <HeaderSearchResults
              searchResults={addresses}
              onHistoryClear={resetAddresses}
              onItemClick={onAddressClick}
              onItemDelete={onAddressRemove}
            />
          )}
        </SearchBarWrapper>
      </>
    </ClickAwayListener>
  );
};
