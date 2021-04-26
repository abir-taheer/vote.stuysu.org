import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: JWT!): JWT!
    logout: Void!

    createElection(
      name: String!
      url: String!
      pictureId: ObjectId!
      type: ElectionType!
      allowedGradYears: [PositiveInt!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    editElection(
      id: ObjectId!
      name: String!
      url: String!
      pictureId: ObjectId!
      type: ElectionType!
      allowedGradYears: [PositiveInt!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    createUser(
      firstName: String!
      lastName: String!
      gradYear: PositiveInt
      email: EmailAddress!
      adminPrivileges: Boolean!
    ): User!

    editUser(
      id: ObjectId!
      firstName: String!
      lastName: String!
      gradYear: PositiveInt
      email: EmailAddress!
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
