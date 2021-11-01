import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";

export default async (_, { id, active }, { adminRequired }) => {
  adminRequired();

  const candidate = await Candidate.findById(id);
  if (!candidate) {
    throw new UserInputError("There's no candidate with that id");
  }

  const election = await Election.findById(candidate.electionId);

  if (election.completed) {
    throw new ForbiddenError(
      "That election is closed and so the candidate can no longer be suspended on reinstated."
    );
  }

  candidate.active = active;
  await candidate.save();

  return candidate;
};
