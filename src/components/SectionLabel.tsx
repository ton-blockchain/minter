import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface Props{
    children: ReactNode;
}

function SectionLabel({children}: Props) {
  return (
    <Typography
      style={{
        fontWeight: 600,
        fontSize: 14,
        marginBottom: 25,
        position: "relative",
        left: "-10px",
      }}
    >
     {children}
    </Typography>
  );
}

export default SectionLabel;
