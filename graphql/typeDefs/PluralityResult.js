import { gql } from "graphql-tag";

export default gql`
  type PluralityResult {
    candidateResults: [PluralityCandidateResult!]!
    winner: Candidate
    isTie: Boolean!
    totalVotes: NonNegativeInt!
    numEligibleVoters: NonNegativeInt!
  }
`;
