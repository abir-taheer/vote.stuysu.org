import { gql } from "apollo-server-micro";

export default gql`
  enum ElectionTypes {
    runoff
    plurality
  }
`;
