import User from "../../../models/user";

export default (
  _,
  { firstName, lastName, email, gradYear, adminPrivileges },
  { adminRequired }
) => {
  adminRequired();

  return User.create({
    firstName,
    lastName,
    email,
    gradYear,
    adminPrivileges,
  });
};
