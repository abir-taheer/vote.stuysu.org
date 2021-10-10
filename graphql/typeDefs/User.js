import { gql } from "apollo-server-micro";

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
