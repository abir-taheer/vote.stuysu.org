import { gql } from "graphql-tag";

export default gql`
  input PictureInput {
    alt: String!
    file: Upload!
  }
`;
