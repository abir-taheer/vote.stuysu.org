import { gql } from "apollo-server-micro";

export default gql`
  type PluralityVote {
    id: NonEmptyString!
    gradYear: PositiveInt
    choice: Candidate
  }
`;
