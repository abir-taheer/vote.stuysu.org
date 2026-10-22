import { gql } from "graphql-tag";

export default gql`
  type RunoffRoundResult {
    candidate: Candidate!
    eliminated: Boolean!
    percentage: NonNegativeFloat!
    numVotes: NonNegativeInt!
  }
`;
