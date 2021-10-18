import { gql } from "apollo-server-micro";

export default gql`
  type FAQ {
    id: ObjectID!
    title: NonEmptyString!
    url: NonEmptyString!
    body: String!
    plainTextBody: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
