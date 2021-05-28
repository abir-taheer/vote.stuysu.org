import Candidate from "../../../models/candidate";

export default ({ choices }) => Candidate.idLoader.loadMany(choices);
