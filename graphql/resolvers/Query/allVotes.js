import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";
export default async (
  _,
  { election: { id, url } },
  { authenticationRequired }
) => {
  authenticationRequired();

  if (!url && !id) {
    throw new UserInputError("You need to pass an id or url to use this query");
  }

  if (url && id) {
    throw new UserInputError(
      "You cannot pass both an id and a url at the same time"
    );
  }

  let election;

  if (id) {
    election = await Election.findById(id)
      .select("+runoffVotes +pluralityVotes")
      .exec();
  } else if (url) {
    election = await Election.findOne({ url })
      .select("+runoffVotes +pluralityVotes")
      .exec();
  }

  if (!election) {
    throw new UserInputError("There's no election with that url or id");
  }

  if (!election.completed) {
    throw new ForbiddenError(
      "You are not allowed to view the votes at this time"
    );
  }

  const votes = Array.from(
    election.type === "runoff" ? election.runoffVotes : election.pluralityVotes
  );

  votes.sort((a, b) => a.id.toString().localeCompare(b.id.toString()));

  return votes;
};
