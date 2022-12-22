import useNotification from "hooks/useNotification";
import { useForm } from "react-hook-form";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { Box, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { AppButton } from "components/appButton";
import { CenteringWrapper } from "components/header/headerSearchBar/styled";
import { EditLogoPopup } from "components/editLogoPopup";
import {
  JettonFormTitle,
  StyledActionBtn,
  StyledForm,
  StyledFormInputs,
} from "components/form/styled";
import { Input } from "components/form/input";
import { LogoAlertPopup } from "components/logoAlertPopup";
import { useJettonLogo } from "hooks/useJettonLogo";
import coinLogoHover from "assets/icons/coin-logo-hover.svg";
import { StyledTopImg } from "pages/jetton/styled";
import LoadingImage from "components/LoadingImage";
import { AppHeading } from "components/appHeading";
import { useJettonAddress } from "hooks/useJettonAddress";

interface FormProps {
  onSubmit: (values: any) => Promise<void>;
  inputs: any[];
  disableExample?: boolean;
  submitText: string;
  defaultValues?: {};
  onCancel?: () => void;
}

export function Form({
  onSubmit,
  inputs,
  disableExample,
  submitText,
  defaultValues,
  onCancel,
}: FormProps) {
  const { showNotification } = useNotification();
  const { address, toggleConnect } = useConnectionStore();
  const { jettonLogo, setIconHover } = useJettonLogo();
  const [logoAlertPopup, setLogoAlertPopup] = useState(false);
  const [editLogoPopup, setEditLogoPopup] = useState(false);
  const { id } = useJettonAddress();
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
        if (!jettonLogo.logoUrl || jettonLogo.hasError) {
          setLogoAlertPopup(true);
          return;
        }
        onSubmit(getValues());
      }, onFormError)}>
      <EditLogoPopup
        showExample={!id}
        showPopup={editLogoPopup}
        tokenImage={tokenImage}
        close={closeEditLogoPopup}
      />
      <LogoAlertPopup
        isUpdateText={!!id}
        showPopup={logoAlertPopup}
        close={closeAlertLogoPopup}
        onValidate={handleSubmit(onSubmit, onFormError)}
      />
      <Box sx={{ display: "flex" }} mb={3}>
        <CenteringWrapper sx={{ position: "relative" }}>
          <img
            alt="Hover icon"
            style={{
              cursor: "pointer",
              position: "absolute",
              left: 0,
              top: 0,
              opacity: jettonLogo.iconHover ? 0.5 : 0,
              zIndex: 1,
            }}
            onClick={() => setEditLogoPopup(true)}
            onMouseEnter={() => setIconHover(true)}
            onMouseLeave={() => setIconHover(false)}
            src={coinLogoHover}
            width={101}
            height={101}
          />
          <StyledTopImg>
            <LoadingImage
              src={jettonLogo.image}
              loading={jettonLogo.isLoading}
              alt="jetton image"
            />
          </StyledTopImg>
        </CenteringWrapper>
        <Box ml={3}>
          <JettonFormTitle>
            {jettonData?.name || "Jetton name"} ({jettonData?.symbol || "Symbol"})
          </JettonFormTitle>
          <Tooltip
            arrow
            title={
              jettonData.description && jettonData.description?.length > 80
                ? jettonData.description
                : ""
            }>
            <Box sx={{ maxWidth: 300, maxHeight: 60 }}>
              <AppHeading
                text={jettonData.description || "Description"}
                limitText={80}
                variant="h4"
                fontWeight={500}
                fontSize={16}
                color="#728A96"
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>
      <StyledFormInputs>
        {inputs
          .filter((i) => i.name !== "tokenImage")
          .filter((i) => onCancel && i.name !== "decimals")
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
                showDefault={spec.showDefault}
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
          <CenteringWrapper sx={{ justifyContent: "center" }}>
            {onCancel && (
              <Box sx={{ width: 96, height: 44 }}>
                <AppButton
                  disabled={jettonLogo.isLoading}
                  transparent
                  onClick={onCancel}
                  type="button">
                  Cancel
                </AppButton>
              </Box>
            )}
            <Box sx={{ width: 110, height: 44 }} ml={2}>
              <AppButton disabled={jettonLogo.isLoading} type="submit">
                {submitText}
              </AppButton>
            </Box>
          </CenteringWrapper>
        )}
      </StyledActionBtn>
    </StyledForm>
  );
}
