import { UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";

export default async (root, { id }, { adminRequired }) => {
  adminRequired();
  const election = await Election.findById(id);

  if (!election) {
    throw new UserInputError("There's no election with that id");
  }

  election.pluralityResults = null;
  election.runoffResults = null;
  election.completed = false;
  await election.save();
  return election;
};
