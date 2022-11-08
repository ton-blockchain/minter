import React, { useCallback, useEffect, useState } from "react";
import SearchImg from "assets/icons/search.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES, SEARCH_HISTORY } from "consts";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import {
  CenteringWrapper,
  IndentlessIcon,
  SearchBarInput,
  SearchBarWrapper,
  SearchResultsItem,
  SearchResultsWrapper,
} from "./styled";
import recentSearch from "assets/icons/recent-search.svg";
import close from "assets/icons/close.svg";
import { Backdrop, ClickAwayListener, IconButton, Typography } from "@mui/material";
import { AppButton } from "components/appButton";

interface SearchBarProps {
  closeMenu?: () => void;
  resetExample?: () => void;
  example?: string;
}

interface SearchRequest {
  index: number;
  value: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ example, resetExample, closeMenu }) => {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchRequest[]>([]);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const onSubmit = useCallback(async () => {
    const searchResults = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY) || "[]");
    const isAlreadyInTheList = searchResults.find((item: SearchRequest) => {
      return item.value === value;
    });

    if (!value) {
      return;
    }

    if (!isValidAddress(value)) {
      showNotification("Invalid jetton address", "error");
      setValue("");
      return;
    }

    !isAlreadyInTheList &&
      setSearchResults((prevState) => [...prevState, { index: searchResults.length, value }]);

    setValue("");
    setActive(false);
    closeMenu?.();
    navigate(`${ROUTES.jetton}/${value}`);
  }, [value]);

  const onItemDelete = useCallback(
    (item: SearchRequest) => {
      setSearchResults((prev) => prev.filter((result) => result.value !== item.value));
    },
    [searchResults],
  );

  const onItemClick = useCallback((item: SearchRequest) => {
    setActive(false);
    navigate(`${ROUTES.jetton}/${item.value}`);
  }, []);

  useEffect(() => {
    resetExample?.();
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        event.target.blur();
        onSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value, onSubmit]);

  useEffect(() => {
    example && setValue(example);
  }, [example]);

  useEffect(() => {
    window.localStorage.setItem(SEARCH_HISTORY, JSON.stringify(searchResults));
  }, [searchResults]);

  return (
    <ClickAwayListener onClickAway={() => setActive(false)}>
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: 2, overflow: "hidden" }}
          open={active}
          onClick={() => setActive(false)}></Backdrop>
        <SearchBarWrapper>
          <IndentlessIcon>
            <img src={SearchImg} width={18} height={18} alt="Search Icon" />
          </IndentlessIcon>
          <SearchBarInput
            placeholder="Jetton address"
            onPaste={(e: any) => setValue(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onFocus={() => setActive(true)}
            spellCheck={false}
          />
          {!!value.length && (
            <IconButton onClick={() => setValue("")}>
              <img src={close} alt="Close Icon" width={18} height={18} />
            </IconButton>
          )}
          <AppButton height={34} width={40} onClick={onSubmit} transparent>
            Go
          </AppButton>
          {active && !!searchResults.length && (
            <SearchResultsWrapper>
              {searchResults.map((result) => (
                <SearchResultsItem>
                  <CenteringWrapper onClick={() => onItemClick(result)}>
                    <CenteringWrapper mr={1.5}>
                      <img width={18} height={18} src={recentSearch} alt="Search Icon" />
                    </CenteringWrapper>
                    <Typography>{result.value}</Typography>
                  </CenteringWrapper>
                  <IconButton onClick={() => onItemDelete(result)}>
                    <img src={close} alt="Close Icon" width={18} height={18} />
                  </IconButton>
                </SearchResultsItem>
              ))}
            </SearchResultsWrapper>
          )}
        </SearchBarWrapper>
      </>
    </ClickAwayListener>
  );
};
