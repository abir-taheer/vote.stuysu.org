import { ForbiddenError, UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default async (
  _,
  { id, firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired, user: authenticatedUser }
) => {
  adminRequired();

  const user = await User.findById(id);

  if (!user) {
    throw new UserInputError("There's no user with that id");
  }

  if (user.email !== email || user.gradYear !== gradYear) {
    const exists = await User.exists({ email, gradYear });

    if (exists) {
      throw new UserInputError(
        "There's already another user with that email and graduation year."
      );
    }
  }

  if (user.id === authenticatedUser.id && !adminPrivileges) {
    throw new ForbiddenError(
      "You are not allowed to remove your own admin privileges. Ask another admin to do this for you."
    );
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.gradYear = gradYear;
  user.adminPrivileges = adminPrivileges;
  await user.save();

  return user;
};
