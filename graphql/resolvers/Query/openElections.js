import { UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";

export default (_, { query, page, resultsPerPage }) => {
  if (resultsPerPage < 1 || resultsPerPage > 50) {
    throw new UserInputError(
      "The number of results per page must be between 1 and 50"
    );
  }

  if (page < 1) {
    throw new UserInputError("Page must be greater than 0");
  }

  return Election.queryElections({
    query,
    page,
    resultsPerPage,
    filters: { completed: false },
  });
};
