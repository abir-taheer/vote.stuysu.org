import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import ProfileChange from "../../../models/profileChange";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();
  const candidate = await Candidate.findById(id);

  if (!candidate) {
    throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const election = await Election.findById(candidate.electionId);

  const idString = id.toString();

  const unremovable =
    election.runoffVotes?.some((vote) =>
      vote.choices.some((c) => c.toString() === idString)
    ) ||
    election.pluralityVotes?.some(
      (vote) => vote.choice.toString() === idString
    );

  if (unremovable) {
    throw new GraphQLError(
      "That candidate has votes for them and cannot be removed at this time. You may try suspending them instead.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  await ProfileChange.deleteMany({
    candidateId: candidate.id,
  });

  await Candidate.deleteOne({ _id: id });
};
