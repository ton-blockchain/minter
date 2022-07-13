import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function FieldDescription({ children }: Props) {
  return (
    <Typography style={{ fontSize: 14, marginTop: 5, opacity: 0.3, paddingLeft: 13 }}>
      {children}
    </Typography>
  );
}

export default FieldDescription;
