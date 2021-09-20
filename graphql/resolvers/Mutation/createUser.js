import { UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default async (
  _,
  { firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
) => {
  adminRequired();

  const existingUser = await User.exists({ email, gradYear });

  if (existingUser) {
    throw new UserInputError(
      "There's already a user with that email and graduation year."
    );
  }

  return await User.create({
    firstName,
    lastName,
    email,
    gradYear,
    adminPrivileges,
  });
};
