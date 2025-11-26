import { gql } from "graphql-tag";

export default gql`
  type FAQQueryResult {
    page: NonNegativeInt!
    total: NonNegativeInt!
    numPages: NonNegativeInt!
    resultsPerPage: PositiveInt!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [FAQ!]!
  }
`;
