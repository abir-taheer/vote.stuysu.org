import { gql } from "apollo-server-micro";

export default gql`
  type ElectionResult {
    page: Int!
    total: Int!
    numPages: Int!
    resultsPerPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [Election!]!
  }
`;
