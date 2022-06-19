import { Button } from "@mui/material";
import React, { ReactNode } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const StyledButton = styled(LoadingButton)({
  width: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
});

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiCircularProgress-root":{
    color:'white'
  }
});

function BaseButton({
  children,
  loading,
  disabled,
  onClick,
  type = "button",
}: Props) {
  return (
    <StyledBox>
      <StyledButton
        type={type}
        onClick={onClick ? onClick : () => {}}
        variant="contained"
        loading={loading}
        disabled={disabled}
      >
        {children}
      </StyledButton>
    </StyledBox>
  );
}

export default BaseButton;
