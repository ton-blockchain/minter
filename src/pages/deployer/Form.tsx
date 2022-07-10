import BaseButton from "components/BaseButton";
import useNotification from "hooks/useNotification";
import { useForm } from "react-hook-form";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { formSpec } from "./data";
import { Box, TextField, Tooltip, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { styled } from "@mui/material";
import { useRef } from "react";
import FieldDescription from "components/FieldDescription";
import SectionLabel from "components/SectionLabel";
import NumberFormat from "react-number-format";

interface FormProps {
  onSubmit: (values: any) => Promise<void>;
}

function Form({ onSubmit }: FormProps) {
  const { showNotification } = useNotification();
  const { address, toggleConnect } = useConnectionStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });

  const onFormError = (value: any) => {
    const firstError = value[Object.keys(value)[0]];
    if (!firstError) {
      return;
    }
    showNotification(<>{firstError.message}</>, "warning", undefined, 3000);
  };

  const onExampleClick = (name: string, value: string | number) => {
    setValue(name, value);
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit, onFormError)}>
      <SectionLabel>Create your own new Jetton</SectionLabel>
      <StyledFormInputs>
        {formSpec.map((spec, index) => {
          return (
            <Input
              required={spec.required}
              description={spec.description}
              clearErrors={clearErrors}
              key={index}
              error={errors[spec.name]}
              name={spec.name}
              type={spec.type}
              control={control}
              label={spec.label}
              defaultValue={spec.default || ""}
              onExamleClick={onExampleClick}
              disabled={spec.disabled}
              errorMessage={spec.errorMessage}
            />
          );
        })}
      </StyledFormInputs>

      <StyledActionBtn>
        {!address ? (
          <BaseButton type="button" onClick={() => toggleConnect(true)}>
            Connect wallet
          </BaseButton>
        ) : (
          <BaseButton type="submit">Deploy</BaseButton>
        )}
      </StyledActionBtn>
    </StyledForm>
  );
}

export default Form;

const StyledForm = styled("form")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "#F7FAFC",
  borderRadius: 16,
  padding: "20px 30px 30px 30px",
  [theme.breakpoints.down("lg")]: {},
  [theme.breakpoints.down("md")]: {},
}));

const StyledFormInputs = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 17,
});

const StyledActionBtn = styled(Box)({
  marginTop: 40,
  height: 46,
  maxWidth: 344,
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  "& .base-button": {
    width: "100%",
  },
});

interface InputProps {
  error: boolean;
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
  errorMessage?: string;
  description: string;
}

function Input({
  description,
  defaultValue,
  control,
  error,
  label,
  name,
  onExamleClick,
  type = "string",
  clearErrors,
  disabled,
  errorMessage,
}: InputProps) {
  const ref = useRef<any>();

  const onClick = () => {
    onExamleClick(name, defaultValue);
    clearErrors(name);
  };

  const onFocus = () => {
    clearErrors(name);
  };

  return (
    <StyledContainer>
      <Controller
        name={name}
        control={control}
        defaultValue={disabled ? defaultValue : ""}
        rules={{
          required: errorMessage,
        }}
        render={({ field: { onChange, value } }) => (
          <StyledInputContainer error={error}>
            {type === "number" ? (
              <NumberFormat
                value={value}
                name={name}
                customInput={StyledInput}
                type="text"
                thousandSeparator=","
                onValueChange={({ value }) => {
                  onChange(value);
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
            {!disabled && (
              <BaseButton transparent onClick={onClick}>
                Example
              </BaseButton>
            )}
          </StyledInputContainer>
        )}
      />
      <FieldDescription>{description}</FieldDescription>
    </StyledContainer>
  );
}

const StyledContainer = styled(Box)({
  width: "100%",
});

const StyledInputContainer = styled(Box)(({ error }: { error: boolean }) => ({
  width: "100%",
  height: 46,
  display: "flex",
  alignItems: "center",
  background: "#EDF2F7",
  borderRadius: 10,
  paddingRight: 5,
  border: error ? "1px solid #F06360" : "1px solid transparent",
  transition: "0.2s all",
  "& .base-button": {
    height: "calc(100% - 10px)",
    padding: "0px 15px",
    fontSize: 12,
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
  color: "unset",
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
