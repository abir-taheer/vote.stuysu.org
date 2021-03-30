import { gql } from "apollo-server-micro";

export default gql`
  type Picture {
    id: ObjectId!
    alt: String!
    resource: CloudinaryResource
  }
`;
