import { gql } from "graphql-tag";

export default gql`
  type CandidateProfileStringChange {
    id: ObjectID!

    candidate: Candidate!
    createdBy: User!
    field: CandidateProfileChangeFieldType!
    value: String!

    reviewed: Boolean!
    reviewedBy: User
    approved: Boolean!
    reasonForRejection: String

    reviewedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
