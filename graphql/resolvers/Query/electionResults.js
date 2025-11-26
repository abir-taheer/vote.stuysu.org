import { GraphQLError } from "graphql";
import Election from "../../../models/election";

export default async (_, { election: { id, url } }, { user, signedIn }) => {
  if (!url && !id) {
    throw new GraphQLError(
      "You need to pass either an id or a url to query the results of an election",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  if (url && id) {
    throw new GraphQLError("Do not pass both an id and a url", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const election = id
    ? await Election.findById(id)
    : await Election.findOne({ url });

  if (!election) {
    throw new GraphQLError("There's no election with that id or url", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (!election.completed) {
    if (!signedIn || !user.adminPrivileges) {
      throw new GraphQLError(
        "You are not allowed to view the results of this election yet",
        { extensions: { code: "FORBIDDEN" } }
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
