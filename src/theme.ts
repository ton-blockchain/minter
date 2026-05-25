import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1EAEFB",
      contrastText: "#fff",
    },
    secondary: {
      main: "#93A5B8",
    },
    background: {
      default: "#10161F",
      paper: "#1D2633CC",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#93A5B8",
    },
    divider: "#364459",
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#FF5147",
    },
  },
  typography: {
    fontFamily: '"Google Sans Flex", "Google Sans", Inter, -apple-system, sans-serif',
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
