import { UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";

export default async (_, { election: { id, url } }, { user, signedIn }) => {
  if (!url && !id) {
    throw new UserInputError(
      "An id or url must be provided to view if a user voted for an election"
    );
  }

  if (!signedIn) {
    return null;
  }

  const filter = {};

  if (id) {
    filter.id = id;
  } else if (url) {
    filter.url = url;
  }

  const election = await Election.findOne(filter).select("+votedIds").exec();

  if (!election) {
    throw new UserInputError("There's no election with that url or id");
  }

  return election.voterIds.includes(user.id);
};
