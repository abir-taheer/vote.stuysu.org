import { gql } from "apollo-server-micro";

export default gql`
  type Picture {
    id: ObjectID!
    alt: String!
    resource: CloudinaryResource
  }
`;
