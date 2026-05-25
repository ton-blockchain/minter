import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { SearchBar } from "components/header/headerSearchBar";
import { EXAMPLE_ADDRESS, APP_GRID } from "consts";

const SearchSectionWrapper = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  margin: "0 auto",
  paddingTop: 24,
  paddingBottom: 24,
  borderBottom: "0.5px solid #364459",
  marginBottom: 32,
  [theme.breakpoints.down("md")]: {
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 24,
  },
  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

const ExampleText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  opacity: 0.6,
  color: "#93A5B8",
  marginTop: 8,
  marginLeft: 18,
}));

const ExampleLink = styled("span")({
  fontWeight: 800,
  cursor: "pointer",
  "&:hover": {
    color: "#1EAEFB",
  },
});

interface SearchSectionProps {
  example?: string;
  setExample: (val: string | undefined) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ example, setExample }) => {
  return (
    <SearchSectionWrapper>
      <SearchBar example={example} resetExample={() => setExample(undefined)} />
      <ExampleText>
        Enter an existing Jetton contract address.
        <ExampleLink onClick={() => setExample(EXAMPLE_ADDRESS)}> Use example.</ExampleLink>
      </ExampleText>
    </SearchSectionWrapper>
  );
};
