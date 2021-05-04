import Announcement from "../../../models/announcement";

export default (_, { query, resultsPerPage, page }) =>
  Announcement.queryAnnouncements({ query, page, resultsPerPage });
