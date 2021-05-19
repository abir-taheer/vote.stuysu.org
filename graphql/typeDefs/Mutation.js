import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: JWT!): JWT!
    logout: Void

    createElection(
      name: NonEmptyString!
      url: NonEmptyString!
      pictureId: ObjectId!
      type: ElectionType!
      allowedGradYears: [PositiveInt!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    editElection(
      id: ObjectId!
      name: NonEmptyString!
      url: NonEmptyString!
      pictureId: ObjectId!
      type: ElectionType!
      allowedGradYears: [PositiveInt!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    createAnnouncement(
      title: NonEmptyString!
      body: NonEmptyString!
      permanent: Boolean!
      end: DateTime
      start: DateTime
      showOnHome: Boolean!
      electionId: ObjectId
    ): Announcement!

    editAnnouncement(
      id: ObjectId!
      title: NonEmptyString!
      body: NonEmptyString!
      permanent: Boolean!
      end: DateTime
      start: DateTime
      showOnHome: Boolean!
      electionId: ObjectId
    ): Announcement!

    deleteAnnouncement(id: ObjectId!): Void

    createUser(
      firstName: NonEmptyString!
      lastName: NonEmptyString!
      gradYear: PositiveInt
      email: EmailAddress!
      adminPrivileges: Boolean!
    ): User!

    editUser(
      id: ObjectId!
      firstName: NonEmptyString!
      lastName: NonEmptyString!
      gradYear: PositiveInt
      email: EmailAddress!
      adminPrivileges: Boolean!
    ): User!

    deleteUser(id: ObjectId!): Void

    createCandidate(
      electionId: ObjectId!
      name: NonEmptyString!
      blurb: String!
      platform: String!
      url: NonEmptyString!
      managerIds: [ObjectId!]!
      """
      If a picture id is not provided a picture will be generated using initials
      """
      pictureId: ObjectId
    ): Candidate!

    editCandidate(
      id: ObjectId!
      name: NonEmptyString!
      url: NonEmptyString!
      blurb: String!
      platform: String!
      managerIds: [ObjectId!]!
      pictureId: ObjectId
    ): Candidate

    completeElection(id: ObjectId!): Election!
    openElection(id: ObjectId!): Election!

    votePlurality(electionId: ObjectId!, candidateId: ObjectId!): PluralityVote!

    uploadPicture(alt: NonEmptyString!, file: Upload!): Picture!

    syncUsersWithStuyActivities: StuyActivitiesSync!
  }
`;
