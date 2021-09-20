import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import withApollo from "next-with-apollo";
import { PUBLIC_URL } from "../../constants";

const uri = process.env.NEXT_PUBLIC_API_URL || PUBLIC_URL + "/api/graphql";

export default withApollo(
  ({ ctx }) => {
    const cache = new InMemoryCache({});
    const authorization =
      ctx?.req?.cookies["auth-jwt"] ||
      globalThis.localStorage?.getItem("auth-jwt") ||
      "";

    return new ApolloClient({
      cache,
      uri,
      headers: {
        authorization,
      },
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
