import { gql } from "graphql-tag";

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
