import  { ReactNode } from "react";
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
  fullWidth?: boolean;
}

interface StyledButtonProps{
  fontSize: number;
  fullWidth?: boolean;
}

const StyledButton = styled(LoadingButton)(({fontSize, fullWidth}:StyledButtonProps) => ({
  marginLeft: "auto",
  marginRight: "auto",
  fontSize: fontSize,
  boxShadow:'none',
  borderRadius: 6,
  fontWeight: 600,
  padding: fullWidth ? 0 : '',
  width: fullWidth ? '100%' : 'fit-content',
  height:fullWidth ? '100%' : ''
  
}));

const StyledBox = styled(Box)(({fullWidth}:{fullWidth?: boolean}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: fullWidth ? '100%' : 'unset',
  height: fullWidth ? '100%' : 'unset',
  
  "& .MuiCircularProgress-root":{
    color:'white'
  }
}))

function BaseButton({
  children,
  loading,
  disabled,
  onClick,
  type = "button",
  fontSize = 14,
  minWidth,
  fullWidth
}: Props) {
  return (
    <StyledBox className="base-button" fullWidth={fullWidth}>
      <StyledButton
        fontSize={fontSize}
        type={type}
        onClick={onClick ? onClick : () => {}}
        variant="contained"
        loading={loading}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        {children}
      </StyledButton>
    </StyledBox>
  );
}

export default BaseButton;
