import { FormControl, TextField } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller } from "react-hook-form";
import { styled } from "@mui/styles";

interface Props {
  error: boolean;
  errorText: string;
  label: string;
  control: any;
  name: string;
  defaultValue?: string | number;
}

const StyledInput = styled(TextField)({

})

function Input({ defaultValue, control, error, errorText, label, name }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <FormControl>
          <TextField value={value} onChange={onChange} label={label} />
          {error && errorText&& <FormHelperText>{errorText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export default Input;
