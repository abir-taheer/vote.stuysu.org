import { GraphQLError } from "graphql";
import User from "../../../models/user";

export default async (
  _,
  { firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
) => {
  adminRequired();

  const existingUser = await User.exists({ email, gradYear });

  if (existingUser) {
    throw new GraphQLError(
      "There's already a user with that email and graduation year.",
      { extensions: { code: "BAD_USER_INPUT" } }
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
