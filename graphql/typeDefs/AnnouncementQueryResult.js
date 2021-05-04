import { gql } from "apollo-server-micro";

export default gql`
  type AnnouncementQueryResult {
    page: NonNegativeInt!
    total: NonNegativeInt!
    numPages: NonNegativeInt!
    resultsPerPage: PositiveInt!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [Announcement!]!
  }
`;
