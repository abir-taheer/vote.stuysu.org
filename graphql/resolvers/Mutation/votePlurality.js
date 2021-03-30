import Election from "../../../models/election";
import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";
import mongoose from "../../../models/mongoose";

export default async (
  _,
  { candidateId, electionId },
  { authenticationRequired, user }
) => {
  authenticationRequired();

  const election = await Election.findById(electionId);

  if (!election) {
    throw new UserInputError("There's no election with that id");
  }
  election.verifyUserCanVote(user);

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new UserInputError("There is no candidate with that id");
  }

  if (!candidate.isActive) {
    throw new ForbiddenError(
      "That candidate is not running and you may not cast a vote for them"
    );
  }

  // All of the checks are complete and now we can actually record the vote
  if (!election.pluralityVotes) {
    election.pluralityVotes = [];
  }

  const vote = {
    id: new mongoose.Types.ObjectId(),
    gradYear: user.gradYear,
    choice: candidate.id,
  };

  election.pluralityVotes.push(vote);

  await election.save();

  return vote;
};
