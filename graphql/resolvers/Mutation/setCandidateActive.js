import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";

export default async (_, { id, active }, { adminRequired }) => {
  adminRequired();

  const candidate = await Candidate.findById(id);
  if (!candidate) {
    throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const election = await Election.findById(candidate.electionId);

  if (election.completed) {
    throw new GraphQLError(
      "That election is closed and so the candidate can no longer be suspended on reinstated.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  candidate.active = active;
  await candidate.save();

  return candidate;
};
