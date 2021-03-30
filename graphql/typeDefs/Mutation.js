import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: String!): String!
    logout: Boolean

    createElection(
      name: String!
      url: String!
      coverPicId: ObjectId!
      type: ElectionType!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    editElection(
      id: ObjectId!
      name: String!
      url: String!
      coverPicId: ObjectId!
      type: ElectionType!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    createUser(
      firstName: String!
      lastName: String!
      gradYear: Int
      email: String!
      adminPrivileges: Boolean!
    ): User!

    editUser(
      id: ObjectId!
      firstName: String!
      lastName: String!
      gradYear: Int
      email: String!
      adminPrivileges: Boolean!
    ): User!

    completeElection(id: ObjectId!): Election!
    
    votePlurality(electionId: ObjectId!, candidateId: ObjectId!): PluralityVote!
  }
`;
