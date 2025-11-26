import { GraphQLError } from "graphql";
import User from "../../../models/user";

export default (_, { query, page, resultsPerPage }, { adminRequired }) => {
  adminRequired();

  if (resultsPerPage < 1 || resultsPerPage > 50) {
    throw new GraphQLError(
      "The number of results per page must be between 1 and 50",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  if (page < 1) {
    throw new GraphQLError("Page must be greater than 0", { extensions: { code: "BAD_USER_INPUT" } });
  }

  return User.queryUsers({ query, page, resultsPerPage });
};
