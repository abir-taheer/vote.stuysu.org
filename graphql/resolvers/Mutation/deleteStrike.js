import { UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";

export default async (_, { candidateId, strikeId }, { adminRequired }) => {
  adminRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new UserInputError("There's no candidate with that id");
  }

  const strikeIndex = candidate.strikes?.findIndex(
    (strike) => strike._id.toString() === strikeId.toString()
  );

  if (strikeIndex === -1) {
    throw new UserInputError("There's no strike with that id");
  }

  candidate.strikes.splice(strikeIndex, 1);

  await candidate.save();
};
