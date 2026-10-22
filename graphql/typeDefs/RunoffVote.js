import { gql } from "graphql-tag";

export default gql`
  type RunoffVote {
    id: NonEmptyString!
    gradYear: PositiveInt
    choices: [Candidate]!
  }
`;
