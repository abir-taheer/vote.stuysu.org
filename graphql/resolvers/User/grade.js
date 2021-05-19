import calcGrade from "../../../utils/user/calcGrade";

export default (user, args, { authenticationRequired }) => {
  authenticationRequired();

  if (typeof user.gradYear !== "number") {
    return null;
  }

  return calcGrade(user.gradYear);
};
