import { Box, Fade, styled } from "@mui/material";
import { ReactNode } from "react";

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
  background: "#F7FAFC",
  width: "100%",
  borderRadius: "20px",
  maxHeight: 'calc(100vh - 140px)',
  overflow:'auto'
});

const ScreenContent = ({ children }: { children: ReactNode }) => {
  return <StyledContent> {children}</StyledContent>;
};

function Screen({ children, id = "" }: Props) {
  return (
    <Fade in>
      <StyledScreen id={id}>{children}</StyledScreen>
    </Fade>
  );
}

export { Screen, ScreenContent };
