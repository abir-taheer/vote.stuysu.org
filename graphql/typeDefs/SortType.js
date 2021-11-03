import { gql } from "apollo-server-micro";

export default gql`
  enum SortType {
    random
    alphabeticalDesc
    alphabeticalAsc
  }
`;
