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
  fontSize?: number;
  minWidth?: number;
}

interface StyledButtonProps{
  fontSize: number;
  minWidth?: number;
}

const StyledButton = styled(LoadingButton)(({fontSize, minWidth}:StyledButtonProps) => ({
  width: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  fontSize: fontSize,
  minWidth: minWidth || 'unset'
}));

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
  fontSize = 16,
  minWidth
}: Props) {
  return (
    <StyledBox>
      <StyledButton
        fontSize={fontSize}
        minWidth={minWidth}
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
