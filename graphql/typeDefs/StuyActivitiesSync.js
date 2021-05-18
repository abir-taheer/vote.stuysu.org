import { gql } from "apollo-server-micro";

export default gql`
  type StuyActivitiesSync {
    totalUsersCreated: NonNegativeInt!
    completedAt: Date!
  }
`;
