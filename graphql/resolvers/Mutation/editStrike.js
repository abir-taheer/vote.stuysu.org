import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";

export default async (
  _,
  { candidateId, strikeId, weight, reason },
  { adminRequired }
) => {
  adminRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const strike = candidate.strikes.find(
    (a) => a._id.toString() === strikeId.toString()
  );

  if (!strike) {
    throw new GraphQLError("There's no strike with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  strike.reason = reason;
  strike.weight = weight;
  strike.updatedAt = new Date();

  await candidate.save();

  return strike;
};
