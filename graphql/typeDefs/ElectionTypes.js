import { gql } from "graphql-tag";

export default gql`
  enum ElectionType {
    runoff
    plurality
  }
`;
