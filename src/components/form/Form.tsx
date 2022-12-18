import useNotification from "hooks/useNotification";
import { useForm } from "react-hook-form";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Box, Tooltip } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AppButton } from "components/appButton";
import { CenteringWrapper } from "components/header/headerSearchBar/styled";
import { EditLogoPopup } from "components/editLogoPopup";
import {
  JettonFormDescription,
  JettonFormTitle,
  StyledActionBtn,
  StyledForm,
  StyledFormInputs,
} from "components/form/styled";
import { Input } from "components/form/input";
import { LogoAlertPopup } from "components/logoAlertPopup";
import { useJettonLogo } from "hooks/useJettonLogo";

interface FormProps {
  onSubmit: (values: any) => Promise<void>;
  inputs: any[];
  disableExample?: boolean;
  submitText: string;
  defaultValues?: {};
}

export function Form({ onSubmit, inputs, disableExample, submitText, defaultValues }: FormProps) {
  const { showNotification } = useNotification();
  const { address, toggleConnect } = useConnectionStore();
  const { jettonLogo, setIconHover, setImageValidationError } = useJettonLogo();
  const [logoAlertPopup, setLogoAlertPopup] = useState(false);
  const [editLogoPopup, setEditLogoPopup] = useState(false);
  const tokenImage = inputs.filter((i) => i.name === "tokenImage")?.[0];
  const { control, handleSubmit, formState, setValue, clearErrors, watch, getValues } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });

  const errors = formState.errors as any;

  const onFormError = (value: any) => {
    const firstError = value[Object.keys(value)[0]];
    if (!firstError) {
      return;
    }
    showNotification(<>{firstError.message}</>, "warning", undefined, 3000);
  };

  const onExampleClick = useCallback((name: never, value: never) => {
    setValue(name, value);
  }, []);

  const closeEditLogoPopup = useCallback(() => setEditLogoPopup(false), []);

  const closeAlertLogoPopup = useCallback(() => setLogoAlertPopup(false), []);

  const jettonData: any = watch();

  useEffect(() => {
    //@ts-ignore
    setValue("tokenImage", jettonLogo.logoUrl);
  }, [jettonLogo.logoUrl]);

  return (
    <StyledForm
      onSubmit={handleSubmit(() => {
        if (!jettonLogo.logoUrl || jettonLogo.imageValidationError) {
          setLogoAlertPopup(true);
          return;
        }
        onSubmit(getValues());
      }, onFormError)}>
      <EditLogoPopup showPopup={editLogoPopup} tokenImage={tokenImage} close={closeEditLogoPopup} />
      <LogoAlertPopup
        showPopup={logoAlertPopup}
        close={closeAlertLogoPopup}
        onValidate={handleSubmit(onSubmit, onFormError)}
      />
      <Box sx={{ display: "flex" }} my={3}>
        <CenteringWrapper>
          <img
            alt="Jetton icon"
            style={{ cursor: "pointer" }}
            onError={() => jettonLogo.logoUrl?.length && setImageValidationError(true)}
            onClick={() => setEditLogoPopup(true)}
            onMouseEnter={() => setIconHover(true)}
            onMouseLeave={() => setIconHover(false)}
            src={jettonLogo.image}
            width={101}
            height={101}
          />
        </CenteringWrapper>
        <Box ml={3}>
          <JettonFormTitle>
            {jettonData?.name || "Jetton name"}({jettonData?.symbol || "Symbol"})
          </JettonFormTitle>
          <JettonFormDescription>
            {jettonData.description?.length > 80 ? (
              <Tooltip arrow title={jettonData.description}>
                <Box sx={{ maxHeight: 100 }}>{jettonData.description.slice(0, 80) + "..."}</Box>
              </Tooltip>
            ) : jettonData?.description ? (
              jettonData.description
            ) : (
              "Project unabbreviated name with spaces (1-3 words)"
            )}
          </JettonFormDescription>
        </Box>
      </Box>
      <StyledFormInputs>
        {inputs
          .filter((i) => i.name !== "tokenImage")
          .map((spec: any, index: number) => {
            return (
              <Input
                disableExample={disableExample}
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
                onExampleClick={() => onExampleClick(spec.name as never, spec.default as never)}
                disabled={spec.disabled}
                errorMessage={spec.errorMessage}
                validate={spec.validate}
              />
            );
          })}
      </StyledFormInputs>
      <StyledActionBtn>
        {!address ? (
          <AppButton
            height={44}
            width={150}
            fontWeight={700}
            type="button"
            onClick={() => toggleConnect(true)}
            background="#0088CC">
            Connect wallet
          </AppButton>
        ) : (
          <AppButton width={150} height={44} type="submit">
            {submitText}
          </AppButton>
        )}
      </StyledActionBtn>
    </StyledForm>
  );
}
