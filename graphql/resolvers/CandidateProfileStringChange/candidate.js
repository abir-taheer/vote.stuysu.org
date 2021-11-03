import Candidate from "../../../models/candidate";

export default (c) => Candidate.idLoader.load(c.candidateId);
