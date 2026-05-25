import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  zeroPadding?: boolean;
}

//TODO replace with generic AppHeading

function FieldDescription({ children, zeroPadding }: Props) {
  return (
    <Typography
      component="span"
      style={{
        display: "block",
        fontSize: 14,
        marginTop: 5,
        opacity: 0.6,
        color: "#93A5B8",
        paddingLeft: zeroPadding ? 0 : 18,
      }}>
      {children}
    </Typography>
  );
}

export default FieldDescription;
