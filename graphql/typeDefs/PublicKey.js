import { gql } from "@apollo/client";

export default gql`
  type PublicKey {
    key: String!
    expiration: DateTime!
  }
`;
