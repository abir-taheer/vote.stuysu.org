import { GraphQLError } from "graphql";
import FAQ from "../../../models/faq";

export default (_, { query, resultsPerPage, page }) => {
  if (resultsPerPage > 100) {
    throw new GraphQLError(
      "The resultsPerPage parameter cannot be larger than 100",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  return FAQ.queryFAQs({ query, resultsPerPage, page });
};
