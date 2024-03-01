import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import withApollo from "../comps/apollo/withApollo";
import AdminWrapper from "../comps/auth/AdminWrapper";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import NavBar from "../comps/navigation/NavBar";
import Footer from "../comps/shared/Footer";
import ThemeContext from "../comps/theme/ThemeContext";
import { PUBLIC_URL } from "../constants";
import "../styles/globals.css";

ReactGA.initialize(process.env.NEXT_APP_GTAG_ID || "G-H31TC1CQTT");

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    ReactGA.event("page_view", {
      page_path: router.asPath,
      page_search: "",
      page_hash: "",
    });
  }, [router.asPath]);

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <UserProvider>
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
      </UserProvider>
    </LocalizationProvider>
  );
}

export default withApollo(App);
