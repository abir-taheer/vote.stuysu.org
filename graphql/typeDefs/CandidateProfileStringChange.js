import { gql } from "apollo-server-micro";

export default gql`
  type CandidateProfileStringChange {
    id: ObjectID!

    createdBy: User!
    field: CandidateProfileChangeFieldType!
    value: String!

    reviewed: Boolean!
    reviewedBy: User!
    approved: Boolean!
    reasonForRejection: String

    createdAt: DateTime!
    reviewedAt: DateTime!
    updatedAt: DateTime!
  }
`;
