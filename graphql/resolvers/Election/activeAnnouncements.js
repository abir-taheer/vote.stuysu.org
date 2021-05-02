import Announcement from "../../../models/announcement";

export default (election) =>
  Announcement.electionIdLoaderActive.load(election.id);
