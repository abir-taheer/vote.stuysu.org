import { ApolloError, ForbiddenError } from "apollo-server-micro";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import getIdTokenPayload from "../../../utils/auth/getIdTokenPayload";
import User from "../../../models/user";
import getJWTSecret from "../../../utils/auth/getJWTSecret";
import { sign } from "jsonwebtoken";
import validateIdTokenPayload from "../../../utils/auth/validateIdTokenPayload";

export default async (mutation, { idToken }, { signedIn }) => {
  if (signedIn) {
    throw new ForbiddenError("You are already signed in.");
  }

  fieldsCannotBeEmpty({ idToken });

  const payload = await getIdTokenPayload(idToken);
  validateIdTokenPayload(payload);

  const user = await User.findByEmail();

  if (!user) {
    throw new ApolloError(
      "There is no user with that email address",
      "UNKNOWN_USER"
    );
  }

  const { id, email, firstName, lastName } = user;

  const tokenData = {
    user: {
      id,
      email,
      firstName,
      lastName,
    },
  };

  const secret = await getJWTSecret();

  return sign(tokenData, secret, { expiresIn: "30d" });
};
