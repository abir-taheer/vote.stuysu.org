import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";
import User from "../../../models/user";

export default async (_, { election: { id, url } }, { user, signedIn }) => {
  if (!url && !id) {
    throw new UserInputError("You need to pass an id or url");
  }

  if (url && id) {
    throw new UserInputError(
      "You cannot pass both an id and a url at the same time"
    );
  }

  let election;

  if (id) {
    election = await Election.findById(id).select("+voterIds");
  } else if (url) {
    election = await Election.findOne({ url }).select("+voterIds");
  }

  if (!election) {
    throw new UserInputError("There's no election with that url or id");
  }

  if (!election.completed) {
    if (!signedIn || !user.adminPrivileges) {
      throw new ForbiddenError(
        "You are not allowed to view the votes at this time"
      );
    }
  }

  const users = await User.idLoader.loadMany(election.voterIds);

  users.sort((a, b) => a.name.localeCompare(b.name));

  return users;
};
