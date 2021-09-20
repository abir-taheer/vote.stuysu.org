import MomentUtils from "@date-io/moment";
import { StylesProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import ReactGA from "react-ga";
import withApollo from "../comps/apollo/withApollo";
import AdminWrapper from "../comps/auth/AdminWrapper";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import NavBar from "../comps/navigation/NavBar";
import Footer from "../comps/shared/Footer";
import ThemeContext from "../comps/theme/ThemeContext";
import { PUBLIC_URL } from "../constants";
import "../styles/globals.css";

ReactGA.initialize(process.env.NEXT_APP_GTAG_ID || "UA-75064374-8");

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    ReactGA.pageview(router.asPath);
  }, [router.asPath]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <UserProvider>
        <StylesProvider injectFirst>
          <ThemeContext>
            <SnackbarProvider
              classes={{
                variantSuccess: "successSnackbar",
              }}
            >
              <Head>
                <title>StuyBOE Voting Site</title>
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="StuyBOE Voting Site" />
                <meta property="og:url" content={PUBLIC_URL + router.asPath} />
              </Head>
              <NavBar />

              <AdminWrapper>
                <Component {...pageProps} />
              </AdminWrapper>

              <SharedDialog />
              <Footer />
            </SnackbarProvider>
          </ThemeContext>
        </StylesProvider>
      </UserProvider>
    </MuiPickersUtilsProvider>
  );
}

export default withApollo(App);
