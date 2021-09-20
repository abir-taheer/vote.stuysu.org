import { ApolloError, ForbiddenError } from "apollo-server-micro";
import { sign } from "jsonwebtoken";
import User from "../../../models/user";
import getIdTokenPayload from "../../../utils/auth/getIdTokenPayload";
import getJWTSecret from "../../../utils/auth/getJWTSecret";
import validateIdTokenPayload from "../../../utils/auth/validateIdTokenPayload";

export default async (mutation, { idToken }, { signedIn, setCookie }) => {
  if (signedIn) {
    throw new ForbiddenError("You are already signed in.");
  }

  const payload = await getIdTokenPayload(idToken);
  validateIdTokenPayload(payload);

  const user = await User.findByEmail(payload.email);

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

  const jwt = sign(tokenData, secret, { expiresIn: "30d" });
  setCookie("auth-jwt", jwt, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30 * 1000,
    path: "/",
  });

  return jwt;
};
