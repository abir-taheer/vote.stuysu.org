import { ForbiddenError } from "apollo-server-micro";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";

export default async (
  mutation,
  { idToken, setSessionCookie },
  { signedIn }
) => {
  if (signedIn) {
    throw new ForbiddenError("You are already signed in.");
  }

  fieldsCannotBeEmpty({ idToken });

  // TODO: ADD IMPLEMENTATION FOR LOGIN

  return null;
};
