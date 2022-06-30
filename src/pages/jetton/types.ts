import { AlertColor } from "@mui/material";
import { ReactNode } from "react";


export type JettonDetailMessage = {
  type: AlertColor;
  text: string;
};

export type JettonDetailButton = {
  text: string;
  action: () => void;
};

