import { gql } from "apollo-server-micro";

export default gql`
  input PictureInput {
    alt: String!
    file: Upload!
  }
`;
