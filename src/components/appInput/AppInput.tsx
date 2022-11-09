import { Box, styled, TextField } from "@mui/material";
import NumberFormat from "react-number-format";

const InputWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  "& .MuiTextField-root": {
    "& .MuiInputLabel-root": {
      color: "#7A828A",
      fontSize: 16,
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& input": {
      fontSize: 16,
    },
  },
}));

interface InputProps {
  showLabel?: boolean;
}

const TextInput = styled(TextField)((props: InputProps) => ({ theme }) => ({
  background: "#F7F9FB",
  borderRadius: 40,
  border: "none",
  paddingLeft: theme.spacing(1),
  "& fieldset": {
    border: "none",
    background: "none",
  },
  "&::placeholder": {
    marginLeft: 15,
  },
  "& label": {
    display: props.showLabel ? "inline" : "none",
    marginLeft: theme.spacing(0.8),
    "&.Mui-focused": {
      display: "none",
    },
  },
}));

interface AppInputProps {
  fullWidth?: boolean;
  label?: string;
  value?: string | number;
  onChange: (e: any) => void;
}

export const AppTextInput: React.FC<AppInputProps> = ({ fullWidth, value, label, onChange }) => {
  return (
    <InputWrapper>
      <TextInput
        fullWidth={fullWidth}
        label={label}
        value={value}
        onChange={onChange}
        showLabel={!value}
      />
    </InputWrapper>
  );
};

//TODO separate text and number inputs into separate files, refactor AppNumberInput

interface AppNumberInputProps {
  onChange: (val: number) => void;
  value?: number;
  label?: string;
}

export const AppNumberInput: React.FC<AppNumberInputProps> = ({ value, label, onChange }) => {
  return (
    <InputWrapper>
      <NumberFormat
        sx={{
          background: "#F7F9FB",
          borderRadius: 40,
          paddingLeft: 1,
          border: "none",
          "& fieldset": {
            border: "none",
            background: "none",
          },
          "& label": {
            display: !value ? "inline" : "none",
            marginLeft: 0.8,
            "&.Mui-focused": {
              display: "none",
            },
          },
        }}
        value={value || ""}
        customInput={TextField}
        thousandSeparator=","
        fullWidth
        label={label}
        onValueChange={({ value }) => {
          onChange(Number(value));
        }}
      />
    </InputWrapper>
  );
};
