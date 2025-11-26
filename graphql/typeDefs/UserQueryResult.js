import { gql } from "graphql-tag";

export default gql`
  type UserQueryResult {
    page: PositiveInt!
    total: PositiveInt!
    numPages: PositiveInt!
    resultsPerPage: PositiveInt!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [User!]!
  }
`;
