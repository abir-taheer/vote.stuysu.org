import Candidate from "../../../models/candidate";

export default (_, { id }) => Candidate.idLoader.load(id);
