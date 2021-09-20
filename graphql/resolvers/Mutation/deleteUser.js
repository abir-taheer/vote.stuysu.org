import { ForbiddenError, UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default async (
  _,
  { id },
  { adminRequired, user: authenticatedUser }
) => {
  adminRequired();
  const user = await User.findById(id);
  if (!user) {
    throw new UserInputError("There's no user with that id");
  }

  if (user.id === authenticatedUser.id) {
    throw new ForbiddenError(
      "You are not allowed to delete yourself. If necessary ask another admin to do so for you."
    );
  }

  const hasEverVoted = await user.hasEverVoted();

  if (hasEverVoted) {
    throw new ForbiddenError(
      "That user has voted at least once and cannot be deleted"
    );
  }

  await user.delete();
};
