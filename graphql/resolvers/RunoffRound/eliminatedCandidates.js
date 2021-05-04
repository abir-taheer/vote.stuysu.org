import Candidate from "../../../models/candidate";

export default (r) => Candidate.idLoader.loadMany(r.eliminatedCandidateIds);
