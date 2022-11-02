import React, { useCallback, useEffect, useState } from "react";
import SearchImg from "assets/icons/search.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import { IndentlessIcon, SearchBarInput, SearchBarWrapper } from "./styled";

interface SearchBarProps {
  closeMenu?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ closeMenu }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const onSubmit = useCallback(async () => {
    if (!value) {
      return;
    }

    if (!isValidAddress(value)) {
      showNotification("Invalid jetton address", "error");
      setValue("");
      return;
    }

    setValue("");
    closeMenu?.();
    navigate(`${ROUTES.jetton}/${value}`);
  }, [value]);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        onSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value, onSubmit]);

  return (
    <SearchBarWrapper>
      <IndentlessIcon onClick={onSubmit}>
        <img src={SearchImg} alt="Search Icon" />
      </IndentlessIcon>
      <SearchBarInput
        placeholder="Jetton address"
        onPaste={(e: any) => setValue(e.target.value)}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </SearchBarWrapper>
  );
};
