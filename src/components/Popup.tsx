import { Box, IconButton, styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { ReactNode } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
export interface Props {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  backgroundColor?: string;
  blur?: boolean;
  className?: string;
  maxWidth: number;
}

export function Popup({
  open,
  onClose,
  children,
  backgroundColor = "rgba(48, 48, 48, 0.4)",
  blur = true,
  className = "",
  maxWidth,
}: Props) {
  return (
    <Dialog
      className={`${className} ${blur && "popup-filter"}`}
      fullWidth
      onClose={onClose}
      open={open}
      PaperProps={{
        style: {
          maxWidth: maxWidth || "unset",
          width: "100%",
          borderRadius: "10px",
          padding: 0,
          overflow:'unset',
          margin: 20
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor,
        },
      }}
    >
      <StyledChildren>
        <StyledClose onClick={onClose}>
          <CloseRoundedIcon style ={{width: 30, height: 30}} />
        </StyledClose>
        {children}
      </StyledChildren>
    </Dialog>
  );
}


const StyledClose = styled(IconButton)(({theme}) => ({
  position:'absolute',
  top:-50,
  right: -50,
  [theme.breakpoints.down('sm')]: {
    right: -10
  }
}))

const StyledChildren = styled(Box)({
  position:'relative',
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: 30,
  "& .title": {
    texAlign: "center",
    fontWeight: 500,
    fontSize: 20,
    marginBottom: 20,
  },
  "& .base-button": {
    height: 40,
    marginTop: 30,
  },
});
