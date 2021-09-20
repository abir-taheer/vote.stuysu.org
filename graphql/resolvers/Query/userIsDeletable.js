import { UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const user = await User.findById(id);

  if (!user) {
    throw new UserInputError("There's no user with that id");
  }

  const hasEverVoted = await user.hasEverVoted();

  return !hasEverVoted;
};
