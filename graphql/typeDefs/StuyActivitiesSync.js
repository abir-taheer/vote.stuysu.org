import { gql } from "apollo-server-micro";

export default gql`
  type StuyActivitiesSync {
    totalUsersCreated: PositiveInt!
    completedAt: Date!
  }
`;
