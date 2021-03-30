import Election from "../../../models/election";
import { UserInputError } from "apollo-server-micro";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const election = await Election.findById(id);

  if (!election) {
    throw new UserInputError("There's no election with that id");
  }

  if (election.type === "plurality") {
    election.pluralityResults = await election.calculatePluralityResults();
  }

  if (election.type === "runoff") {
    election.runoffResults = await election.calculateRunoffResults();
  }

  election.completed = true;

  await election.save();

  return election;
};
