import { UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default (_, { query, page, resultsPerPage }, { adminRequired }) => {
  adminRequired();

  if (resultsPerPage < 1 || resultsPerPage > 50) {
    throw new UserInputError(
      "The number of results per page must be between 1 and 50"
    );
  }

  if (page < 1) {
    throw new UserInputError("Page must be greater than 0");
  }

  return User.queryUsers({ query, page, resultsPerPage });
};
