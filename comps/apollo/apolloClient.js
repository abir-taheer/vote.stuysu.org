import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

const headers = {};
const authJwt = globalThis.localStorage?.getItem("auth-jwt");

if (authJwt) {
  headers["auth-jwt"] = authJwt;
}

const apolloClient = new ApolloClient({
  uri: "/api/graphql",
  headers,
  cache,
});

export default apolloClient;
