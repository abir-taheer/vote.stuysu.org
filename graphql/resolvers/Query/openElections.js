import { GraphQLError } from "graphql";
import Election from "../../../models/election";

const sixtyDays = 1000 * 60 * 60 * 24 * 60;

export default (_, { query, page, resultsPerPage }) => {
  if (resultsPerPage < 1 || resultsPerPage > 50) {
    throw new GraphQLError(
      "The number of results per page must be between 1 and 50",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  if (page < 1) {
    throw new GraphQLError("Page must be greater than 0", { extensions: { code: "BAD_USER_INPUT" } });
  }

  return Election.queryElections({
    query,
    page,
    resultsPerPage,
    filters: {
      completed: false,
      end: { $gt: new Date(Date.now() - sixtyDays) },
    },
  });
};
