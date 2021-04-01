import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PUBLIC_URL } from "../../constants";

const uri = process.env.NEXT_PUBLIC_API_URL || PUBLIC_URL + "/api/graphql";

const createClient = (ctx) => {
  const cache = new InMemoryCache({});
  const authorization = ctx?.req?.cookies["auth-jwt"] || "";

  return new ApolloClient({
    uri,
    headers: {
      authorization,
    },
    cache,
  });
};

export default createWithApollo(createClient);
