import { TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import { StyledInput } from "styles/styles";

interface Props {
  onChange: (val: number) => void;
  value?: number;
  label?: string;
}

function NumberInput({ onChange, value, label = "" }: Props) {
  return (
    <StyledInput>
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
    </StyledInput>
  );
}

export default NumberInput;
