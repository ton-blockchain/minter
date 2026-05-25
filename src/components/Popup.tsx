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
  maxWidth: number | string;
  hideCloseButton?: boolean;
  paddingTop?: boolean;
}

export function Popup({
  open,
  onClose,
  children,
  backgroundColor = "rgba(16, 22, 31, 0.6)",
  blur = true,
  className = "",
  maxWidth,
  hideCloseButton,
  paddingTop,
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
          borderRadius: "20px",
          padding: 0,
          overflow: "unset",
          margin: 20,
          background: "#1D2633",
          border: "0.5px solid #364459",
          boxShadow: "0 1px 1px 0 #2D3945 inset, 0px 2px 16px rgba(0, 0, 0, 0.3)",
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor,
          backdropFilter: blur ? "blur(4px)" : "none",
        },
      }}>
      <Box>
        {!hideCloseButton && (
          <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
            <StyledClose onClick={onClose}>
              <CloseRoundedIcon style={{ width: 23, height: 23, color: "#93A5B8" }} />
            </StyledClose>
          </Box>
        )}
        <StyledChildren px={3} pb={3} pt={paddingTop ? 3 : 0}>
          {children}
        </StyledChildren>
      </Box>
    </Dialog>
  );
}

const StyledClose = styled(IconButton)(() => ({
  color: "#93A5B8",
  "&:hover": {
    color: "#FFFFFF",
  },
}));

const StyledChildren = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  color: "#FFFFFF",
  "& .title": {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 20,
    marginBottom: 20,
    color: "#FFFFFF",
  },
  "& .base-button": {
    height: 40,
    marginTop: 30,
  },
});
