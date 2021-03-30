import { gql } from "apollo-server-micro";

export default gql`
  enum ElectionType {
    runoff
    plurality
  }
`;
