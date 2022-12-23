import { Control, Controller } from "react-hook-form";
import { useRef } from "react";
import NumberFormat from "react-number-format";
import FieldDescription from "components/FieldDescription";
import { Typography } from "@mui/material";
import { StyledContainer, StyledInput, StyledInputContainer } from "components/form/input/styled";

interface InputProps {
  error: boolean;
  label?: string;
  control: Control;
  name: string;
  defaultValue: string | number;
  onExampleClick: () => void;
  type?: string;
  required?: boolean;
  clearErrors: any;
  disabled?: boolean;
  validate?: (val: string) => boolean;
  errorMessage?: string;
  description: string;
  disableExample?: boolean;
  zeroPadding?: boolean;
  showDefault?: boolean;
}

export function Input({
  description,
  defaultValue,
  control,
  error,
  label,
  name,
  onExampleClick,
  type = "string",
  clearErrors,
  disabled,
  errorMessage,
  disableExample = false,
  validate,
  zeroPadding,
  showDefault,
}: InputProps) {
  const ref = useRef<any>();

  const onFocus = () => {
    clearErrors(name);
  };
  return (
    <StyledContainer>
      <Controller
        name={name}
        control={control}
        defaultValue={showDefault ? defaultValue : ""}
        rules={{
          required: errorMessage,
        }}
        render={({ field: { onChange, value } }) => (
          <StyledInputContainer error={error}>
            {type === "number" ? (
              <NumberFormat
                value={value}
                name={name}
                placeholder={label}
                customInput={StyledInput}
                type="text"
                thousandSeparator=","
                onValueChange={({ value }) => {
                  onChange(value);
                }}
                isAllowed={(values) => {
                  if (validate) return validate(values.value);
                  return true;
                }}
                onFocus={onFocus}
                disabled={disabled}
                style={{
                  opacity: disabled ? 0.5 : 1,
                }}
              />
            ) : (
              <StyledInput
                ref={ref}
                value={value || ""}
                onFocus={onFocus}
                onChange={onChange}
                placeholder={label}
                disabled={disabled}
                type={type}
                style={{
                  opacity: disabled ? 0.5 : 1,
                }}
              />
            )}
          </StyledInputContainer>
        )}
      />
      <FieldDescription zeroPadding={zeroPadding}>
        {description}
        {!disabled && !disableExample && (
          <Typography
            sx={{
              display: "inline",
              fontWeight: 800,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            variant="body2"
            onClick={() => onExampleClick()}>
            {" "}
            example
          </Typography>
        )}
      </FieldDescription>
    </StyledContainer>
  );
}
