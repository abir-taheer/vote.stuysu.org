import { gql } from "graphql-tag";

export default gql`
  type RunoffRound {
    number: NonNegativeInt!
    numVotes: NonNegativeInt!
    results: [RunoffRoundResult!]!
    eliminatedCandidates: [Candidate!]!
  }
`;
