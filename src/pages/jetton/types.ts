import { AlertColor } from "@mui/material";


export type JettonDetailMessage = {
  type: AlertColor;
  text: string;
};

export type JettonDetailAction = {
  text: string;
  action: () => void;
};

