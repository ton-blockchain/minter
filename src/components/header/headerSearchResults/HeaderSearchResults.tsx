import React from "react";
import {
  CenteringWrapper,
  SearchResultsItem,
  SearchResultsWrapper,
} from "components/header/headerSearchBar/styled";
import recentSearch from "assets/icons/recent-search.svg";
import { IconButton, Typography } from "@mui/material";
import close from "assets/icons/close.svg";
import { AppButton } from "components/appButton";
import { SearchRequest } from "components/header/headerSearchBar";

interface HeaderSearchResultsProps {
  searchResults: SearchRequest[];
  onItemClick: (item: SearchRequest) => void;
  onItemDelete: (e: React.MouseEvent, item: SearchRequest) => void;
  onHistoryClear: () => void;
}

export const HeaderSearchResults: React.FC<HeaderSearchResultsProps> = ({
  searchResults,
  onItemClick,
  onItemDelete,
  onHistoryClear,
}) => {
  return (
    <SearchResultsWrapper>
      {searchResults.map((result) => (
        <SearchResultsItem onClick={() => onItemClick(result)}>
          <CenteringWrapper>
            <CenteringWrapper mr={1.5}>
              <img width={18} height={18} src={recentSearch} alt="Search Icon" />
            </CenteringWrapper>
            <Typography>{result.value}</Typography>
          </CenteringWrapper>
          <IconButton onClick={(e) => onItemDelete(e, result)}>
            <img src={close} alt="Close Icon" width={18} height={18} />
          </IconButton>
        </SearchResultsItem>
      ))}
      <CenteringWrapper mt={2} mb={1} ml={1} sx={{ width: "fit-content" }}>
        <AppButton onClick={onHistoryClear} height={34} transparent>
          Clear History
        </AppButton>
      </CenteringWrapper>
    </SearchResultsWrapper>
  );
};
