import { GraphQLError } from "graphql";
import Election from "../../../models/election";

export default async (root, { id }, { adminRequired }) => {
  adminRequired();
  const election = await Election.findById(id);

  if (!election) {
    throw new GraphQLError("There's no election with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  election.pluralityResults = null;
  election.runoffResults = null;
  election.completed = false;
  await election.save();
  return election;
};
