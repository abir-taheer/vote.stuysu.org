import { GraphQLError } from "graphql";
import User from "../../../models/user";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const user = await User.findById(id);

  if (!user) {
    throw new GraphQLError("There's no user with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const hasEverVoted = await user.hasEverVoted();

  return !hasEverVoted;
};
