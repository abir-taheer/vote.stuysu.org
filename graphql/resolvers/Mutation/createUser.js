import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import User from "../../../models/user";

export default (
  _,
  { firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
) => {
  adminRequired();

  fieldsCannotBeEmpty({ firstName, lastName, email });

  return User.create({
    firstName,
    lastName,
    email,
    gradYear,
    adminPrivileges,
  });
};
