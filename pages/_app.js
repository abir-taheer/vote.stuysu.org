import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../comps/apollo/apolloClient";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import { StylesProvider } from "@material-ui/core/styles";
import ThemeContext from "../comps/theme/ThemeContext";
import NavBar from "../comps/navigation/NavBar";
import Footer from "../comps/shared/Footer";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <StylesProvider injectFirst>
          <ThemeContext>
            <NavBar />
            <Component {...pageProps} />
            <SharedDialog />
            <Footer />
          </ThemeContext>
        </StylesProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
