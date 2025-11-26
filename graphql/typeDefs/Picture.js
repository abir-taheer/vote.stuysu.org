import { gql } from "graphql-tag";

export default gql`
  type Picture {
    id: ObjectID!
    alt: String!
    resource: CloudinaryResource
  }
`;
