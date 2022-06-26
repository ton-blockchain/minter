import { AlertColor } from "@mui/material";


export type JettonDetailMessage = {
  type: AlertColor;
  text: string;
};

export type JettonDetailButton = {
  text: string;
  action: () => void;
};

