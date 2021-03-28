import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../comps/apollo/apolloClient";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import { StylesProvider } from "@material-ui/core/styles";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <StylesProvider injectFirst>
          <SharedDialog />
          <Component {...pageProps} />
        </StylesProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
