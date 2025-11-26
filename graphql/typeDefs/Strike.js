import { gql } from "graphql-tag";

export default gql`
  type Strike {
    id: ObjectID!
    reason: String!
    weight: NonNegativeFloat!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
