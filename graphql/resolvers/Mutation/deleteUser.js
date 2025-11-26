import { GraphQLError } from "graphql";
import User from "../../../models/user";

export default async (
  _,
  { id },
  { adminRequired, user: authenticatedUser }
) => {
  adminRequired();
  const user = await User.findById(id);
  if (!user) {
    throw new GraphQLError("There's no user with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (user.id === authenticatedUser.id) {
    throw new GraphQLError(
      "You are not allowed to delete yourself. If necessary ask another admin to do so for you.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  const hasEverVoted = await user.hasEverVoted();

  if (hasEverVoted) {
    throw new GraphQLError(
      "That user has voted at least once and cannot be deleted",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  await user.delete();
};
