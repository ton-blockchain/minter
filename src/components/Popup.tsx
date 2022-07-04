import { Box, styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { ReactNode } from "react";

export interface Props {
  open: boolean;
  onClose?: (value: string) => void;
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
          width: "fot-content",
          borderRadius: "10px",
          padding: 35,
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor,
        },
      }}
    >
      <StyledChildren>{children}</StyledChildren>
    </Dialog>
  );
}

const StyledChildren = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  "& .title": {
    texAlign:'center',
    fontWeight: 500,
    fontSize: 20,
    marginBottom: 20,
  },
  "& .base-button": {
    height: 40,
    marginTop: 30
  }
});
