import { gql } from "apollo-server-micro";

export default gql`
  type Election {
    id: ObjectId!
    name: String!
    url: String!
    allowedGradYears: [Int!]!
    type: ElectionType!
    start: DateTime
    end: DateTime
    completed: Boolean
  }
`;
