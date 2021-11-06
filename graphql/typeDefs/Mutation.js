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

    deleteElection(id: ObjectID!): Void

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
    ): Candidate!

    deleteCandidate(id: ObjectID!): Void

    """
    Suspend or reinstate a candidate using their id
    Admin Only
    """
    setCandidateActive(id: ObjectID!, active: Boolean!): Candidate!

    completeElection(id: ObjectID!): Election!
    openElection(id: ObjectID!): Election!

    votePlurality(electionId: ObjectID!, candidateId: ObjectID!): PluralityVote!
    voteRunoff(electionId: ObjectID!, choices: [ObjectID!]!): RunoffVote!

    syncUsersWithStuyActivities: StuyActivitiesSync!

    createFAQ(title: NonEmptyString!, url: NonEmptyString!, body: String!): FAQ!
    editFAQ(
      id: ObjectID!
      title: NonEmptyString!
      url: NonEmptyString!
      body: String!
    ): FAQ!
    deleteFAQ(id: ObjectID): Void

    requestCandidateProfileChange(
      candidateId: ObjectID!
      pictureId: ObjectID
      blurb: String
      platform: String
    ): CandidateProfileChange!

    reviewCandidateProfileChange(
      id: ObjectID!
      approved: Boolean!
      reasonForRejection: String
    ): CandidateProfileChange!

    deleteCandidateProfileChange(id: ObjectID!): Void

    createStrike(
      candidateId: ObjectID!
      weight: NonNegativeFloat!
      reason: String!
    ): Strike!

    editStrike(
      candidateId: ObjectID!
      strikeId: ObjectID!
      weight: NonNegativeFloat!
      reason: String!
    ): Strike!

    deleteStrike(candidateId: ObjectID!, strikeId: ObjectID!): Void
  }
`;
