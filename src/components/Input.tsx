import { Button, FormControl, TextField } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { Control, Controller } from "react-hook-form";
import { styled } from "@mui/styles";
import { useRef } from "react";
import BaseButton from "./BaseButton";

interface Props {
  error: boolean;
  errorText: string;
  label: string;
  control: Control;
  name: string;
  defaultValue: string | number;
  onExamleClick: (name: string, value: string | number) => void;
  type?: any;
  required?: boolean;
  clearErrors: any;
}

const StyledInput = styled(TextField)({
  "& input": {
   paddingTop: '13px',
   paddingBottom: '13px',
  
  },
  "& button": {
    fontSize:'12px',
    
  }
})

function Input({ required, defaultValue, control, error, errorText, label, name, onExamleClick, type= 'string', clearErrors }: Props) {
  const ref = useRef<any>()

  const onClick = () => {
    onExamleClick(name, defaultValue)
    clearErrors(name);
  }

  const onFocus = () => {
    clearErrors(name);
  }
  
  return (
    <Controller
    
      name={name}
      control={control}
      
      rules={{
        required,
      }}
      
      render={({ field: { onChange, value } }) => (
        <FormControl>
          <StyledInput ref={ref} value={value || ''}
          onFocus={onFocus}
          onChange={onChange} label={label}
          type={type}
           InputProps={{endAdornment: <BaseButton onClick={onClick}>example</BaseButton> }}
          />
          {error && errorText&& <FormHelperText>{errorText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export default Input;
