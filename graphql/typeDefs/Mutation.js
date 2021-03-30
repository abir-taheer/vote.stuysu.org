import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: String!): String!
    logout: Boolean

    createElection(
      name: String!
      url: String!
      coverPicId: String!
      type: ElectionTypes!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election
  }
`;
