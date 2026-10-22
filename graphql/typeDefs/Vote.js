import { gql } from "graphql-tag";

export default gql`
  """
  A union type to return the types of votes
  """
  union Vote = RunoffVote | PluralityVote
`;
