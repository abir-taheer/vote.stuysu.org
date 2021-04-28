import "../styles/globals.css";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import { StylesProvider } from "@material-ui/core/styles";
import ThemeContext from "../comps/theme/ThemeContext";
import NavBar from "../comps/navigation/NavBar";
import Footer from "../comps/shared/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import { PUBLIC_URL } from "../constants";
import { SnackbarProvider } from "notistack";
import React from "react";

function App({ Component, pageProps }) {
  const router = useRouter();

  return (
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
              <meta property={"og:title"} content={"StuyBOE Voting Site"} />
              <meta property="og:locale" content="en_US" />
              <meta property="og:site_name" content="StuyBOE Voting Site" />
              <meta property="og:url" content={PUBLIC_URL + router.asPath} />
              <meta
                property={"og:image"}
                content={"https://vote.stuysu.org/logo512.png"}
              />
              <meta property={"og:image:height"} content={512} />
              <meta property={"og:image:width"} content={512} />
              <meta
                property={"og:image:alt"}
                content={"Board of Elections Logo"}
              />
              <meta property="og:image:type" content="image/png" />
            </Head>
            <NavBar />
            <Component {...pageProps} />
            <SharedDialog />
            <Footer />
          </SnackbarProvider>
        </ThemeContext>
      </StylesProvider>
    </UserProvider>
  );
}

export default App;
