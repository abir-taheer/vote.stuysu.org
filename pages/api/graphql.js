import { ApolloServer, ForbiddenError } from "apollo-server-micro";
import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";
import getJWTData from "../../utils/auth/getJWTData";
import User from "../../models/user";
import unboundSetCookie from "../../utils/middleware/setCookie";
import { createComplexityLimitRule } from "graphql-validation-complexity";

const ComplexityLimitRule = createComplexityLimitRule(25000, {
  scalarCost: 1,
  objectCost: 5,
  listFactor: 10,
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let user, signedIn, anonymousId;

    let jwt =
      req.cookies["auth-jwt"] ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (jwt && jwt.startsWith("Bearer ")) {
      jwt = jwt.replace("Bearer ", "");
    }

    if (jwt) {
      const data = await getJWTData(jwt);

      if (data) {
        user = await User.findById(data.user.id);
        anonymousId = data.user.anonymousId;
      }

      signedIn = Boolean(user);
    }

    function authenticationRequired() {
      if (!signedIn) {
        throw new ForbiddenError("You must be signed in to perform that query");
      }
    }

    function adminRequired() {
      authenticationRequired();
      if (!user.adminPrivileges) {
        throw new ForbiddenError("You must be an admin to perform that query");
      }
    }

    const setCookie = unboundSetCookie.bind(unboundSetCookie, res);

    return {
      user,
      signedIn,
      adminRequired,
      authenticationRequired,
      anonymousId,
      setCookie,
    };
  },
  playground: {
    settings: {
      "schema.polling.enable": false,
      "request.credentials": "same-origin",
      "prettier.useTabs": true,
    },
  },
  introspection: true,
  uploads: {
    maxFileSize: 10000000,
  },
  validationRules: [ComplexityLimitRule],
});

export default apolloServer.createHandler({
  path: "/api/graphql",
  disableHealthCheck: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
