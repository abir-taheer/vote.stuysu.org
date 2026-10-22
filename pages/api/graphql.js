import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ForbiddenError } from "apollo-server-errors";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/typeDefs";
import checkAuth from "../../utils/middleware/checkAuth";
import runMiddleware from "../../utils/middleware/runMiddleware";
import unboundSetCookie from "../../utils/middleware/setCookie";

const ComplexityLimitRule = createComplexityLimitRule(35000, {
  scalarCost: 1,
  objectCost: 5,
  listFactor: 10,
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  validationRules: [ComplexityLimitRule],
});

const APIHandler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    await runMiddleware(req, res, checkAuth);

    const user = req.user;
    const signedIn = req.signedIn;

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
      setCookie,
    };
  },
});

export default APIHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};
