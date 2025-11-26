import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";

export default async (_, { candidateId, strikeId }, { adminRequired }) => {
  adminRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const strikeIndex = candidate.strikes?.findIndex(
    (strike) => strike._id.toString() === strikeId.toString()
  );

  if (strikeIndex === -1) {
    throw new GraphQLError("There's no strike with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  candidate.strikes.splice(strikeIndex, 1);

  await candidate.save();
};
