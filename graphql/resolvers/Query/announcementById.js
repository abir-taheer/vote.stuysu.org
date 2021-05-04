import Announcement from "../../../models/announcement";

export default (_, { id }) => Announcement.findById(id);
