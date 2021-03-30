import { gql } from "apollo-server-micro";

export default gql`
  type Candidate {
    id: ObjectId!
    name: String!
    blurb: String!

    url: String!

    election: Election!

    picture: Picture!
    active: Boolean!
  }
`;
