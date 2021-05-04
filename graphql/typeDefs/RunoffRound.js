import { gql } from "apollo-server-micro";

export default gql`
  type RunoffRound {
    number: NonNegativeInt!
    numVotes: NonNegativeInt!
    results: [RunoffRoundResult!]!
    eliminatedCandidates: [Candidate!]!
  }
`;
