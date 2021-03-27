import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: String!): String!
  }
`;
