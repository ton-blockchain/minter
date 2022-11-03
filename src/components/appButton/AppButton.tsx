import React, { ReactNode } from "react";
import { CircularProgress, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface StyledButtonProps {
  fontSize?: number;
  transparent?: boolean;
  background?: string;
  height?: number;
}

const StyledButton = styled(LoadingButton)((props: StyledButtonProps) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0px 16px",
  margin: "auto",
  maxWidth: 160,
  width: "100%",
  height: props.height || "100%",
  fontSize: props.fontSize || 14,
  boxShadow: "none",
  fontWeight: 600,
  borderRadius: 40,
  border: props.transparent ? "1px solid #50A7EA" : "",
  background: props.background || "",
  whiteSpace: "nowrap",
  "& img": {
    maxWidth: 22,
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
  height,
}) => {
  return (
    <StyledButton
      height={height}
      fontSize={fontSize}
      transparent={transparent}
      background={background}
      className="base-button"
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
