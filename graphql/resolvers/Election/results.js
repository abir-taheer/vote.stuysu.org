import { GraphQLError } from "graphql";

export default (election, _, { user, authenticationRequired }) => {
  if (!election.completed) {
    authenticationRequired();

    if (!user.adminPrivileges) {
      throw new GraphQLError(
        "At this time you must be an admin to view the results of this election",
        { extensions: { code: "FORBIDDEN" } }
      );
    }
  }

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
