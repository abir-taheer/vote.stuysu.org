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
  },
});

const ThemeContext = (props) => {
  return <Provider theme={theme}>{props.children}</Provider>;
};

export default ThemeContext;
