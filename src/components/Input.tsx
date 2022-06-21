import { Box, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { styled } from "@mui/material";
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
  disabled?: boolean;
  validate?: (val: string) => boolean;
}

const StyledError = styled(Box)({
  position: "absolute",
  left: 10,
  top: "calc(100% + 1px)",
  "& p": {
    fontSize: 12,
    fontWeight: 500,
    color: '#F06360'
  },
});

const StyledContainer = styled(Box)(({ error }: { error: boolean }) => ({
  position: "relative",
  width: "100%",
  height: 46,
  display: "flex",
  alignItems: "center",
  background: '#EDF2F7',
  borderRadius: 10,
  paddingRight: 5,
  border: error ? '1px solid #F06360' : '1px solid transparent',
  transition:'0.2s all',
  "& .base-button": {
    height: "calc(100% - 10px)",
    width: 90,
    "& button": {
      padding: "unset",
      width: "100%",
      height: "100%",
      fontSize: 12,
    },
  },
}));

const StyledInput = styled("input")({
  flex: 1,
  height: "100%",
  border: "unset",
  textIndent: 16,
  fontSize: 16,
  background: "transparent",
  outline: "none",

  "&::placeholder": {
    color: "#7A828A",
    transition: "0.2s all",
  },
  "&:focus": {
    "&::placeholder": {
      opacity: 0,
    },
  },
});

function Input({
  validate,
  required,
  defaultValue,
  control,
  error,
  errorText,
  label,
  name,
  onExamleClick,
  type = "string",
  clearErrors,
  disabled,
}: Props) {
  const ref = useRef<any>();

  const onClick = () => {
    onExamleClick(name, defaultValue);
    clearErrors(name);
  };

  const onFocus = () => {
    clearErrors(name);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={disabled ? defaultValue : ""}
      rules={{
        required,
        validate: validate,
      }}
      render={({ field: { onChange, value } }) => (
        <StyledContainer error={error}>
          <StyledInput
            ref={ref}
            value={value || ""}
            onFocus={onFocus}
            onChange={onChange}
            placeholder={label}
            disabled={disabled}
          />
          <BaseButton onClick={onClick}>Example</BaseButton>

          {error && errorText && (
            <StyledError>
              <Typography>{errorText}</Typography>
            </StyledError>
          )}
        </StyledContainer>
      )}
    />
  );
}

export default Input;
