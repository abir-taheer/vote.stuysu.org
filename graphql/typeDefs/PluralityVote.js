import { gql } from "graphql-tag";

export default gql`
  type PluralityVote {
    id: NonEmptyString!
    gradYear: PositiveInt
    choice: Candidate
  }
`;
