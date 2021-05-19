import User from "../../../models/user";
import { UserInputError } from "apollo-server-micro";

export default async (
  _,
  { id, firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
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

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.gradYear = gradYear;
  user.adminPrivileges = adminPrivileges;
  await user.save();

  return user;
};
