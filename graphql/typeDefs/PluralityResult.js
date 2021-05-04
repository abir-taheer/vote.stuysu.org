import { gql } from "apollo-server-micro";

export default gql`
  type PluralityResult {
    candidateResults: [PluralityCandidateResult!]!
    winner: Candidate
    isTie: Boolean!
    totalVotes: NonNegativeInt!
    numEligibleVoters: NonNegativeInt!
  }
`;
