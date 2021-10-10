import { createTheme, ThemeProvider as Provider } from "@mui/material/styles";
import Head from "next/head";

const theme = createTheme({
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
      margin: "0.5em 0",
    },
  },
});

const ThemeContext = (props) => {
  return (
    <>
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <Provider theme={theme}>{props.children}</Provider>
    </>
  );
};

export default ThemeContext;
