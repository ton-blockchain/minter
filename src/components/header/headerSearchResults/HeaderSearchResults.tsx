import React from "react";
import {
  CenteringWrapper,
  SearchResultsItem,
  SearchResultsWrapper,
} from "components/header/headerSearchBar/styled";
import recentSearch from "assets/icons/recent-search.svg";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import close from "assets/icons/close.svg";
import { AppButton } from "components/appButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface HeaderSearchResultsProps {
  searchResults: string[];
  onItemClick: (item: string) => void;
  onItemDelete: (e: any, item: string) => void;
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
        <SearchResultsItem key={result} onClick={() => onItemClick(result)}>
          <CenteringWrapper>
            <CenteringWrapper mr={1.5}>
              <img width={18} height={18} src={recentSearch} alt="Search Icon" />
            </CenteringWrapper>
            <Typography>{result}</Typography>
          </CenteringWrapper>
          <IconButton onClick={(e) => onItemDelete(e, result)}>
            <img src={close} alt="Close Icon" width={18} height={18} />
          </IconButton>
        </SearchResultsItem>
      ))}
      <CenteringWrapper mt={2} mb={1} ml={1} sx={{ width: "fit-content", gap: 1 }}>
        <AppButton onClick={onHistoryClear} height={34} transparent>
          Clear History
        </AppButton>
        <Tooltip
          title="Search history is stored only in your browser. No data is sent to any server."
          arrow
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                background: "#1D2633",
                border: "0.5px solid #364459",
                borderRadius: "10px",
                color: "#93A5B8",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.35,
                padding: "10px 16px",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.3)",
              },
            },
            arrow: {
              sx: {
                color: "#1D2633",
              },
            },
          }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              minWidth: 34,
              minHeight: 34,
              borderRadius: "50%",
              border: "1px solid #364459",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(29, 38, 51, 0.8)",
              flexShrink: 0,
              "&:hover": {
                background: "rgba(37, 50, 68, 0.8)",
              },
            }}>
            <HelpOutlineIcon sx={{ color: "#93A5B8", width: 16, height: 16 }} />
          </Box>
        </Tooltip>
      </CenteringWrapper>
    </SearchResultsWrapper>
  );
};

export * from "./HeaderSearchResults";
