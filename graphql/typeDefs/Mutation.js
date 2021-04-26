import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: String!): String!
    logout: Boolean

    createElection(
      name: String!
      url: String!
      pictureId: ObjectId!
      type: ElectionType!
      allowedGradYears: [Int!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    editElection(
      id: ObjectId!
      name: String!
      url: String!
      pictureId: ObjectId!
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

    createCandidate(
      electionId: ObjectId!
      name: String!
      blurb: String!
      platform: String!
      url: String!
      managerIds: [ObjectId!]!
      """
      If a picture id is not provided a picture will be generated using initials
      """
      pictureId: ObjectId
    ): Candidate!

    editCandidate(
      id: ObjectId!
      name: String!
      url: String!
      blurb: String!
      platform: String!
      managerIds: [ObjectId!]!
      pictureId: ObjectId
    ): Candidate

    completeElection(id: ObjectId!): Election!
    openElection(id: ObjectId!): Election!

    votePlurality(electionId: ObjectId!, candidateId: ObjectId!): PluralityVote!

    uploadPicture(alt: String!, file: Upload!): Picture!

    syncUsersWithStuyActivities: StuyActivitiesSyncResult!
  }
`;
