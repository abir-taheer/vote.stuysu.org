import { gql } from "apollo-server-micro";

export default gql`
  type StuyActivitiesSyncResult {
    totalUsersCreated: Int!
    completedAt: Date!
  }
`;
