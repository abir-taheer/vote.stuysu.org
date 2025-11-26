import { GraphQLError } from "graphql";
import Election from "../../../models/election";

export default async (_, { election: { id, url } }, { user, signedIn }) => {
  if (!url && !id) {
    throw new GraphQLError(
      "An id or url must be provided to view if a user voted for an election",
      { extensions: { code: "BAD_USER_INPUT" } }
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
    throw new GraphQLError("There's no election with that url or id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  return election.voterIds.includes(user.id);
};
