import { gql } from "apollo-server-micro";

export default gql`
  type UserResult {
    page: Int!
    total: Int!
    numPages: Int!
    resultsPerPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [User!]!
  }
`;
