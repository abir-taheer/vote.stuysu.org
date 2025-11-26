import { gql } from "graphql-tag";

export default gql`
  enum SortType {
    random
    alphabeticalDesc
    alphabeticalAsc
  }
`;
