import { gql } from "graphql-tag";

export default gql`
  enum CandidateProfileChangeFieldType {
    pictureId
    blurb
    platform
  }
`;
