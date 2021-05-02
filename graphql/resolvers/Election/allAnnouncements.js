import Announcement from "../../../models/announcement";

export default (election) => Announcement.electionIdLoaderAll.load(election.id);
