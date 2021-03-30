import User from "../../../models/user";
import { UserInputError } from "apollo-server-micro";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";

export default async (
  _,
  { id, firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
) => {
  adminRequired();

  fieldsCannotBeEmpty({ firstName, lastName, email });

  const user = await User.findById(id);

  if (!user) {
    throw new UserInputError("There's no user with that id");
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.gradYear = gradYear;
  user.adminPrivileges = adminPrivileges;
  await user.save();

  return user;
};
