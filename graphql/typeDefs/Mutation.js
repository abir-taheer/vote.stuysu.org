import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: JWT!): JWT!
    logout: Void

    createElection(
      name: NonEmptyString!
      url: NonEmptyString!
      pictureId: ObjectID!
      type: ElectionType!
      allowedGradYears: [PositiveInt!]!
      start: DateTime!
      end: DateTime!
    ): Election!

    editElection(
      id: ObjectID!
      name: NonEmptyString!
      url: NonEmptyString!
      pictureId: ObjectID!
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
      electionId: ObjectID
    ): Announcement!

    editAnnouncement(
      id: ObjectID!
      title: NonEmptyString!
      body: NonEmptyString!
      permanent: Boolean!
      end: DateTime
      start: DateTime
      showOnHome: Boolean!
      electionId: ObjectID
    ): Announcement!

    deleteAnnouncement(id: ObjectID!): Void

    createUser(
      firstName: NonEmptyString!
      lastName: NonEmptyString!
      gradYear: PositiveInt
      email: EmailAddress!
      adminPrivileges: Boolean!
    ): User!

    editUser(
      id: ObjectID!
      firstName: NonEmptyString!
      lastName: NonEmptyString!
      gradYear: PositiveInt
      email: EmailAddress!
      adminPrivileges: Boolean!
    ): User!

    deleteUser(id: ObjectID!): Void

    createCandidate(
      electionId: ObjectID!
      name: NonEmptyString!
      blurb: String!
      platform: String!
      url: NonEmptyString!
      managerIds: [ObjectID!]!
      """
      If a picture id is not provided a picture will be generated using initials
      """
      pictureId: ObjectID
    ): Candidate!

    editCandidate(
      id: ObjectID!
      name: NonEmptyString!
      url: NonEmptyString!
      blurb: String!
      platform: String!
      managerIds: [ObjectID!]!
      pictureId: ObjectID
    ): Candidate

    completeElection(id: ObjectID!): Election!
    openElection(id: ObjectID!): Election!

    votePlurality(electionId: ObjectID!, candidateId: ObjectID!): PluralityVote!
    voteRunoff(electionId: ObjectID!, choices: [ObjectID!]!): RunoffVote!

    syncUsersWithStuyActivities: StuyActivitiesSync!
  }
`;
