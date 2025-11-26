import { GraphQLError } from "graphql";
import Election from "../../../models/election";
import User from "../../../models/user";

export default async (
  _,
  { election: { id, url } },
  { authenticationRequired }
) => {
  authenticationRequired();

  if (!url && !id) {
    throw new GraphQLError("You need to pass an id or url to use this query", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (url && id) {
    throw new GraphQLError(
      "You cannot pass both an id and a url at the same time",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  let election;

  if (id) {
    election = await Election.findById(id).select("+voterIds");
  } else if (url) {
    election = await Election.findOne({ url }).select("+voterIds");
  }

  if (!election) {
    throw new GraphQLError("There's no election with that url or id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (!election.completed) {
    throw new GraphQLError(
      "You are not allowed to view the votes at this time",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  const users = await User.idLoader.loadMany(election.voterIds);

  users.sort((a, b) => {
    const aName = a.firstName + a.lastName;
    const bName = b.firstName + b.lastName;

    let comparison = aName.localeCompare(bName);

    if (comparison === 0) {
      comparison = a.email.localeCompare(b.email);
    }

    return comparison;
  });

  return users;
};
