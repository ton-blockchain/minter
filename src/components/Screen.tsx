import { Box, Fade, styled } from "@mui/material";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id?: string;
}

const StyledScreen = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const StyledContent = styled(Box)({
  background:'#F7FAFC',
  width:'100%',
  borderRadius: '20px'
});

function Screen({ children, id = "" }: Props) {
  return (
    <Fade in>
      <StyledScreen id={id}>
        <StyledContent> {children}</StyledContent>
      </StyledScreen>
    </Fade>
  );
}

export default Screen;
