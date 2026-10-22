import { gql } from "graphql-tag";

export default gql`
  type User {
    id: ObjectID!
    firstName: String
    lastName: String
    email: EmailAddress
    name: String
    gradYear: PositiveInt
    grade: NonNegativeInt
    adminPrivileges: Boolean
  }
`;
