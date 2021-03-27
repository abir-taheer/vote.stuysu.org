import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../comps/apollo/apolloClient";
import UserProvider from "../comps/auth/UserProvider";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
