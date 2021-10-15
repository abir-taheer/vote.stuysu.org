import { UserInputError } from "apollo-server-micro";
import FAQ from "../../../models/faq";

export default (_, { query, resultsPerPage, page }) => {
  if (resultsPerPage > 100) {
    throw new UserInputError(
      "The resultsPerPage parameter cannot be larger than 100"
    );
  }

  return FAQ.queryFAQs({ query, resultsPerPage, page });
};
