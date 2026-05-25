import { Box, styled, TextField } from "@mui/material";
import NumberFormat from "react-number-format";

const InputWrapper = styled(Box)({
  width: "100%",
});
const StyledTextField = styled(TextField)({
  background: "#131B25",
  borderRadius: 40,
  "& .MuiInputBase-root": {
    borderRadius: 40,
    background: "#131B25",
  },
  "& .MuiInputBase-input": {
    color: "#FFFFFF",
    fontSize: 16,
    padding: "14px 16px",
  },
  "& .MuiInputLabel-root": {
    color: "#93A5B8",
    marginLeft: 4,
    top: -2,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1EAEFB",
  },
  "& .MuiInputLabel-root.MuiFormLabel-filled": {
    top: 0,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& fieldset": {
    border: "none",
  },
});

const NumberWrapper = styled(Box)({
  "& .MuiInputBase-root": {
    background: "#131B25",
    borderRadius: 40,
  },
  "& .MuiInputBase-input": {
    color: "#FFFFFF",
    fontSize: 16,
    padding: "14px 16px",
  },
  "& .MuiInputLabel-root": {
    color: "#93A5B8",
    marginLeft: 4,
    top: -2,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1EAEFB",
  },
  "& .MuiInputLabel-root.MuiFormLabel-filled": {
    top: 0,
  },
  "& fieldset": {
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
});
interface AppTextInputProps {
  fullWidth?: boolean;
  label?: string;
  value?: string | number;
  onChange: (e: any) => void;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  fullWidth,
  value,
  label,
  onChange,
}) => {
  return (
    <InputWrapper>
      <StyledTextField fullWidth={fullWidth} label={label} value={value} onChange={onChange} />
    </InputWrapper>
  );
};

interface AppNumberInputProps {
  onChange: (val: number) => void;
  value?: number;
  label?: string;
}

export const AppNumberInput: React.FC<AppNumberInputProps> = ({ value, label, onChange }) => {
  return (
    <InputWrapper>
      <NumberWrapper>
        <NumberFormat
          value={value || ""}
          customInput={TextField}
          thousandSeparator=","
          fullWidth
          label={label}
          onValueChange={({ value }) => {
            onChange(Number(value));
          }}
        />
      </NumberWrapper>
    </InputWrapper>
  );
};
