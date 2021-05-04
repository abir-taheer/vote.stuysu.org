import Candidate from "../../../models/candidate";

export default (r) => (r.winnerId ? Candidate.idLoader.load(r.winnerId) : null);
