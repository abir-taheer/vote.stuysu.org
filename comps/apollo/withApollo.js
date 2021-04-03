import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PUBLIC_URL } from "../../constants";
import { createUploadLink } from "apollo-upload-client";

const uri = process.env.NEXT_PUBLIC_API_URL || PUBLIC_URL + "/api/graphql";

const createClient = (ctx) => {
  const cache = new InMemoryCache({});
  const authorization = ctx?.req?.cookies["auth-jwt"] || "";

  const link = createUploadLink({
    uri,
    headers: {
      authorization,
    },
  });

  return new ApolloClient({
    link,
    cache,
  });
};

export default createWithApollo(createClient);
