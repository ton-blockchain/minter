import { Box, Fade, styled } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id?: string;
  removeBackground?: boolean;
}

const StyledScreen = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const StyledContent = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: {
    maxHeight: "unset",
    paddingBottom: 40,
    paddingTop: 40,
  },
}));

const ScreenContent = ({ children }: Props) => {
  return <StyledContent className="screen-content"> {children}</StyledContent>;
};

function Screen({ children, id = "" }: Props) {
  return (
    <Fade in>
      <StyledScreen id={id}>{children}</StyledScreen>
    </Fade>
  );
}

export { Screen, ScreenContent };
