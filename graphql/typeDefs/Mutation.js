import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: String!): String!
    logout: Boolean

    createElection(
      name: String!
      url: String!
      coverPicId: String!
      type: ElectionType!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election

    editElection(
      id: ObjectId!
      name: String!
      url: String!
      coverPicId: String!
      type: ElectionType!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election
  }
`;
