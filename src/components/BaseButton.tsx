import  { ReactNode } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material";

interface Props {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fontSize?: number;
  transparent?: boolean;
}

interface StyledButtonProps{
  fontSize: number;
}

const StyledButton = styled(LoadingButton)(({fontSize}:StyledButtonProps) => ({
  fontSize: fontSize,
  boxShadow:'none',
  borderRadius: 6,
  fontWeight: 600,
  padding:  '0px 16px',
  height:'100%',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  gap: 8,
  whiteSpace:'nowrap',
  "& img":{
    maxWidth: 22
  },

}));



function BaseButton({
  children,
  loading,
  disabled,
  onClick,
  type = "button",
  fontSize = 14,
  transparent
}: Props) {
  return (
      <StyledButton
       className="base-button"
        fontSize={fontSize}
        type={type}
        onClick={onClick ? onClick : () => {}}
        variant={transparent ? 'outlined' : 'contained'}
        loading={loading}
        disabled={disabled}
        style={{
          border: transparent ? '1px solid #50A7EA' : ''
        }}
      >
        {children}
      </StyledButton>
   
  );
}

export default BaseButton;
