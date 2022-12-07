import React, { useCallback, useEffect } from "react";
import SearchImg from "assets/icons/search.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { IndentlessIcon, SearchBarInput, SearchBarWrapper } from "./styled";
import close from "assets/icons/close.svg";
import { Backdrop, ClickAwayListener, IconButton } from "@mui/material";
import { AppButton } from "components/appButton";
import { HeaderSearchResults } from "components/header/headerSearchResults";
import { atom, useRecoilState } from "recoil";

interface SearchBarAtomProps {
  value: string;
  active: boolean;
  searchResults: SearchRequest[];
}

const searchBarAtom = atom<SearchBarAtomProps>({
  key: "searchBar",
  default: {
    value: "",
    active: false,
    searchResults: [],
  },
});

interface SearchBarProps {
  closeMenu?: () => void;
  resetExample?: () => void;
  example?: string;
}

export interface SearchRequest {
  index: number;
  value: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ example, resetExample, closeMenu }) => {
  const [searchBar, setSearchBar] = useRecoilState(searchBarAtom);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const onSubmit = async () => {
    const isAlreadyInTheList = searchBar.searchResults.find((item) => {
      return item.value === searchBar.value;
    });

    if (!searchBar.value) {
      return;
    }

    if (!isValidAddress(searchBar.value)) {
      showNotification("Invalid jetton address", "error");
      return;
    }

    !isAlreadyInTheList &&
      setSearchBar((old) => ({
        ...old,
        searchResults: [
          ...searchBar.searchResults,
          { index: searchBar.searchResults?.length, value: searchBar.value },
        ],
      }));

    setSearchBar((old) => ({
      ...old,
      value: "",
      active: false,
    }));

    closeMenu?.();
    navigate(`${ROUTES.jetton}/${searchBar.value}`);
  };

  const onItemDelete = useCallback(
    (e: React.MouseEvent, item: SearchRequest) => {
      e.stopPropagation();
      setSearchBar((old) => ({
        ...old,
        searchResults: searchBar.searchResults.filter((prevItem) => prevItem.value !== item.value),
      }));
    },
    [searchBar.searchResults],
  );

  const onHistoryClear = useCallback(() => {
    setSearchBar((old) => ({
      ...old,
      searchResults: [],
    }));
  }, []);

  const onItemClick = useCallback((item: SearchRequest) => {
    setSearchBar((old) => ({
      ...old,
      value: "",
      active: false,
    }));

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
  }, [searchBar.value, onSubmit]);

  useEffect(() => {
    example &&
      setSearchBar((old) => ({
        ...old,
        value: example,
      }));
  }, [example]);

  useEffect(() => {
    setSearchBar((old) => ({
      ...old,
      searchResults: JSON.parse(window.localStorage.getItem("searchBarResults") || "[]"),
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("searchBarResults", JSON.stringify(searchBar.searchResults));
  }, [searchBar.searchResults]);

  return (
    <ClickAwayListener
      onClickAway={() =>
        setSearchBar((old) => ({
          ...old,
          active: false,
        }))
      }>
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: 2, overflow: "hidden" }}
          open={searchBar.active}
          onClick={() =>
            setSearchBar((old) => ({
              ...old,
              active: false,
            }))
          }></Backdrop>
        <SearchBarWrapper>
          <IndentlessIcon>
            <img src={SearchImg} width={18} height={18} alt="Search Icon" />
          </IndentlessIcon>
          <SearchBarInput
            placeholder="Jetton address"
            onPaste={(e: any) =>
              setSearchBar((old) => ({
                ...old,
                value: e.target.value,
              }))
            }
            onChange={(e) =>
              setSearchBar((old) => ({
                ...old,
                value: e.target.value,
              }))
            }
            value={searchBar.value}
            onFocus={() =>
              searchBar.searchResults?.length &&
              setSearchBar((old) => ({
                ...old,
                active: true,
              }))
            }
            spellCheck={false}
          />
          {!!searchBar.value.length && (
            <>
              <IconButton
                onClick={() =>
                  setSearchBar((old) => ({
                    ...old,
                    value: "",
                  }))
                }>
                <img src={close} alt="Close Icon" width={18} height={18} />
              </IconButton>
              <AppButton height={34} width={40} onClick={onSubmit}>
                Go
              </AppButton>
            </>
          )}
          {searchBar.active && !!searchBar.searchResults?.length && (
            <HeaderSearchResults
              searchResults={searchBar.searchResults}
              onHistoryClear={onHistoryClear}
              onItemClick={onItemClick}
              onItemDelete={onItemDelete}
            />
          )}
        </SearchBarWrapper>
      </>
    </ClickAwayListener>
  );
};
