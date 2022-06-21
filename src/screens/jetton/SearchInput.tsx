import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const StyledInput = styled(Box)({
  width: "100%",
  marginBottom: 40,
  "& input": {
    textAlign: "center",
  },
});

interface Props {
  submit: (val: string) => void;
}

function SearchInput({ submit }: Props) {
  const { id }: { id?: string } = useParams();

  const [value, setValue] = useState<string | undefined>(id);

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <StyledInput>
      <TextField
        fullWidth
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      
      />
        <IconButton>
                <SearchIcon />
              </IconButton>
    </StyledInput>
  );
}

export default SearchInput;
