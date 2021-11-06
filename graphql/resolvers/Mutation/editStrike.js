import { UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";

export default async (
  _,
  { candidateId, strikeId, weight, reason },
  { adminRequired }
) => {
  adminRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new UserInputError("There's no candidate with that id");
  }

  const strike = candidate.strikes.find(
    (a) => a._id.toString() === strikeId.toString()
  );

  if (!strike) {
    throw new UserInputError("There's no strike with that id");
  }

  strike.reason = reason;
  strike.weight = weight;
  strike.updatedAt = new Date();

  await candidate.save();

  return strike;
};
