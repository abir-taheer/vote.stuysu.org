import { gql } from "graphql-tag";

export default gql`
  type PluralityCandidateResult {
    candidate: Candidate!
    percentage: NonNegativeFloat!
    numVotes: NonNegativeInt!
  }
`;
