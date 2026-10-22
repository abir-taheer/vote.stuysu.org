import { gql } from "graphql-tag";

export default gql`
  union CandidateProfileChange =
      CandidateProfilePictureChange
    | CandidateProfileStringChange
`;
