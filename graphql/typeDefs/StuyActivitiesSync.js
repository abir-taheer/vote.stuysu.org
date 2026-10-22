import { gql } from "graphql-tag";

export default gql`
  type StuyActivitiesSync {
    totalUsersCreated: NonNegativeInt!
    completedAt: Date!
  }
`;
