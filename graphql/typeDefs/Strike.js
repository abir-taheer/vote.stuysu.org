import { gql } from "apollo-server-micro";

export default gql`
  type Strike {
    id: ObjectID!
    reason: String!
    weight: NonNegativeFloat!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
