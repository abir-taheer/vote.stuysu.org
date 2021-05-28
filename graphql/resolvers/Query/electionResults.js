import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";

export default async (_, { election: { id, url } }, { user, signedIn }) => {
  if (!url && !id) {
    throw new UserInputError(
      "You need to pass either an id or a url to query the results of an election"
    );
  }

  if (url && id) {
    throw new UserInputError("Do not pass both an id and a url");
  }

  const election = id
    ? await Election.findById(id)
    : await Election.findOne({ url });

  if (!election) {
    throw new UserInputError("There's no election with that id or url");
  }

  if (!election.completed) {
    if (!signedIn || !user.adminPrivileges) {
      throw new ForbiddenError(
        "You are not allowed to view the results of this election yet"
      );
    }
  }

  // Now we can return the election results

  if (election.type === "runoff") {
    // Either return the results or a promise for the results
    return election.completed
      ? election.runoffResults
      : election.calculateRunoffResults();
  }

  if (election.type === "plurality") {
    return election.completed
      ? election.pluralityResults
      : election.calculatePluralityResults();
  }
};
