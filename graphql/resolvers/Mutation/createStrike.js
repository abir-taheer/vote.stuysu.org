import { UserInputError } from "apollo-server-micro";
import mongoose from "mongoose";
import Candidate from "../../../models/candidate";

export default async (
  _,
  { candidateId, weight, reason },
  { adminRequired }
) => {
  adminRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new UserInputError("There's no candidate with that id");
  }

  const _id = new mongoose.Types.ObjectId();

  const strike = {
    _id,
    reason,
    weight,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  candidate.strikes.push(strike);
  await candidate.save();

  return {
    ...strike,
    id: strike._id,
  };
};
