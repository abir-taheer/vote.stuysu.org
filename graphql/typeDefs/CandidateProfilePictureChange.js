import { gql } from "apollo-server-micro";

export default gql`
  type CandidateProfilePictureChange {
    id: ObjectID!

    createdBy: User!
    field: CandidateProfileChangeFieldType!
    value: Picture!

    reviewed: Boolean!
    reviewedBy: User
    approved: Boolean!
    reasonForRejection: String

    createdAt: DateTime!
    reviewedAt: DateTime!
    updatedAt: DateTime!
  }
`;
