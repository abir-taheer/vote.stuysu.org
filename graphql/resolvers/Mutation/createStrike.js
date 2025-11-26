import { GraphQLError } from "graphql";
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
    throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
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
