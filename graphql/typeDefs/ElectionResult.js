import { gql } from "apollo-server-micro";

export default gql`
  """
  A union type to return the results of an election depending on what the type of the election is
  """
  union ElectionResult = RunoffResult | PluralityResult
`;
