import { gql } from "apollo-server-micro";

export default gql`
  type FAQ {
    id: ObjectID!
    url: NonEmptyString!
    body: String!
    plainTextString: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
