import Election from "../../../models/election";

export default (announcement) =>
  announcement.electionId
    ? Election.idLoader.load(announcement.electionId)
    : null;
