import Election from "../../../models/election";

export default (candidate) => Election.idLoader.load(candidate.electionId);
