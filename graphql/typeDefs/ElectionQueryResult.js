import { gql } from "graphql-tag";

export default gql`
  type ElectionQueryResult {
    page: NonNegativeInt!
    total: NonNegativeInt!
    numPages: NonNegativeInt!
    resultsPerPage: PositiveInt!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [Election!]!
  }
`;
