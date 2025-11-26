import { gql } from "graphql-tag";

export default gql`
  type RunoffResult {
    rounds: [RunoffRound!]!
    winner: Candidate
    totalVotes: NonNegativeInt!
    isTie: Boolean!
    numEligibleVoters: NonNegativeInt!
  }
`;
