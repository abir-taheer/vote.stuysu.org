import { gql } from "apollo-server-micro";

export default gql`
  union CandidateProfileChange =
      CandidateProfilePictureChange
    | CandidateProfileStringChange
`;
