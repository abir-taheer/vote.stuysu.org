import "../styles/globals.css";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import { StylesProvider } from "@material-ui/core/styles";
import ThemeContext from "../comps/theme/ThemeContext";
import NavBar from "../comps/navigation/NavBar";
import Footer from "../comps/shared/Footer";
import withApollo from "../comps/apollo/withApollo";
import Head from "next/head";
import { useRouter } from "next/router";
import { PUBLIC_URL } from "../constants";

function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <UserProvider>
      <StylesProvider injectFirst>
        <ThemeContext>
          <Head>
            <meta property="og:site_name" content="StuyBOE Voting Site" />
            <meta property="og:url" content={PUBLIC_URL + router.asPath} />
          </Head>
          <NavBar />
          <Component {...pageProps} />
          <SharedDialog />
          <Footer />
        </ThemeContext>
      </StylesProvider>
    </UserProvider>
  );
}

export default withApollo({ ssr: true })(App);
