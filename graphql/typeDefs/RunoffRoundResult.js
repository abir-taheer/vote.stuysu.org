import { gql } from "apollo-server-micro";

export default gql`
  type RunoffRoundResult {
    candidate: Candidate!
    eliminated: Boolean!
    percentage: NonNegativeFloat!
    numVotes: NonNegativeInt!
  }
`;
