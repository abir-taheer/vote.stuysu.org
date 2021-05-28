import { gql } from "apollo-server-micro";

export default gql`
  type RunoffVote {
    id: NonEmptyString!
    gradYear: PositiveInt
    choices: [Candidate]!
  }
`;
