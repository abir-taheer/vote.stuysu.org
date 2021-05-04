import { gql } from "apollo-server-micro";

export default gql`
  type PluralityCandidateResult {
    candidate: Candidate!
    percentage: NonNegativeFloat!
    numVotes: NonNegativeInt!
  }
`;
