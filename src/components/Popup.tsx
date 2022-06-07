import Dialog from "@mui/material/Dialog";
import { ReactNode } from "react";

export interface Props {
  open: boolean;
  onClose?: (value: string) => void;
  children: ReactNode;
  backgroundColor?: string;
  blur?: boolean;
  className?: string;
}

export function Popup({
  open,
  onClose,
  children,
  backgroundColor = "rgba(48, 48, 48, 0.8)",
  blur = true,
  className = "",
}: Props) {
  return (
    <Dialog
      className={`${className} ${blur && "popup-filter"}`}
      fullWidth
      onClose={onClose}
      open={open}
      BackdropProps={{
        style: {
          backgroundColor,
        },
      }}
    >
      {children}
    </Dialog>
  );
}
