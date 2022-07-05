import { Box, styled } from "@mui/material";

export const StyledInput = styled(Box)(({theme}) => ({
  width: "100%",
  "& .MuiTextField-root": {
    "& .MuiInputLabel-root": {
        color: "#7A828A",
        fontSize: 16,
        "&.Mui-focused": {
            color: theme.palette.primary.main
        }
    },
    "& input": {
       fontSize: 16
    }
  },
}));
