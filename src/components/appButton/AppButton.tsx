import React, { ReactNode } from "react";
import { CircularProgress, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface StyledButtonProps {
  fontSize?: number;
  fontWeight?: number;
  transparent?: boolean;
  background?: string;
  width?: number;
  height?: number;
}

const StyledButton = styled(LoadingButton, {
  shouldForwardProp: (prop) => prop !== "transparent",
})((props: StyledButtonProps) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0px 16px",
  margin: "auto",
  maxWidth: 160,
  width: props.width || "100%",
  height: props.height || "100%",
  fontSize: props.fontSize || 14,
  boxShadow: props.transparent ? "none" : "0 1px 1px 0 #2D3945 inset",
  fontWeight: props.fontWeight || 600,
  borderRadius: 40,
  border: props.transparent ? "1px solid #364459" : "none",
  background: props.background
    ? props.background
    : props.transparent
    ? "rgba(29, 38, 51, 0.8)"
    : "#1EAEFB",
  color: "#FFFFFF",
  backdropFilter: props.transparent ? "blur(1px)" : "none",
  whiteSpace: "nowrap",
  transition: "background-color .16s ease, transform .18s ease-out",
  "& img": {
    maxWidth: 22,
  },
  "&:hover": {
    background: props.background
      ? props.background
      : props.transparent
      ? "rgba(37, 50, 68, 0.8)"
      : "#3db8fc",
    transform: "scale(1.03)",
  },
  "&:active": {
    transform: "scale(0.97)",
  },
  "&:disabled": {
    background: "#364459",
    color: "#93A5B8",
  },
  "&:focus-visible": {
    outline: "2px solid #1EAEFB",
    outlineOffset: "3px",
  },
}));

interface AppButtonProps extends StyledButtonProps {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  loading,
  disabled,
  onClick,
  type = "button",
  fontSize = 14,
  transparent,
  background,
  width,
  height,
  fontWeight,
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      transparent={transparent}
      background={background}
      className={children !== "Update metadata" ? "base-button" : ""}
      type={type}
      onClick={onClick ? onClick : () => {}}
      variant={transparent ? "outlined" : "contained"}
      loading={loading}
      disabled={disabled}
      disableElevation
      loadingIndicator={<CircularProgress style={{ color: "white", width: 20, height: 20 }} />}>
      {children}
    </StyledButton>
  );
};

export * from "./AppButton";
