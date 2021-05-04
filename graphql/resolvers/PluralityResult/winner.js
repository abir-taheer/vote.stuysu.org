import Candidate from "../../../models/candidate";

export default (res) =>
  res.winnerId ? Candidate.idLoader.load(res.winnerId) : null;
