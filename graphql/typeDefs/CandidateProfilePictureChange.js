import { gql } from "apollo-server-micro";

export default gql`
  type CandidateProfilePictureChange {
    id: ObjectID!

    candidate: Candidate!
    createdBy: User!
    field: CandidateProfileChangeFieldType!
    picture: Picture!

    reviewed: Boolean!
    reviewedBy: User
    approved: Boolean!
    reasonForRejection: String

    reviewedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
