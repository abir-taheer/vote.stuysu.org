import { gql } from "apollo-server-micro";

export default gql`
  type Query {
    # Returns the current user if authentication is provided (is signed in), otherwise returns null
    authenticatedUser: User
  }
`;
