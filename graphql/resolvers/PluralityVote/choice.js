import Candidate from "../../../models/candidate";

export default (vote) => Candidate.idLoader.load(vote.choice);
