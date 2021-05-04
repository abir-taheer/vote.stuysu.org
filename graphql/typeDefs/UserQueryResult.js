import { gql } from "apollo-server-micro";

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
