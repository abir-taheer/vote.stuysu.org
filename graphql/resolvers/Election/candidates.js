import Candidate from "../../../models/candidate";

export default (election) => Candidate.electionIdLoader.load(election.id);
