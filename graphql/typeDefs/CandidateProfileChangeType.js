import { gql } from "apollo-server-micro";

export default gql`
  enum CandidateProfileChangeFieldType {
    pictureId
    blurb
    platform
  }
`;
