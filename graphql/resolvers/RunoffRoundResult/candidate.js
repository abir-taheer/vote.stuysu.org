import Candidate from "../../../models/candidate";

export default (r) => Candidate.idLoader.load(r.candidateId);
