import { createMuiTheme, ThemeProvider as Provider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6c5ce7",
      contrastText: "#fff",
    },
    secondary: {
      main: "#10ac84",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    fontSize: 14,
    h1: {
      fontSize: "2em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "1.5em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.17em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    body1: {
      margin: "0.5em 0"
    }
  },
});

const ThemeContext = (props) => {
  return <Provider theme={theme}>{props.children}</Provider>;
};

export default ThemeContext;
