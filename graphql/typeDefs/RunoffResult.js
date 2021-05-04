import { gql } from "apollo-server-micro";

export default gql`
  type RunoffResult {
    rounds: [RunoffRound!]!
    winner: Candidate
    totalVotes: NonNegativeInt!
    isTie: Boolean!
    numEligibleVoters: NonNegativeInt!
  }
`;
