import Candidate from "../../../models/candidate";

export default (_, { id }) => Candidate.findById(id);
