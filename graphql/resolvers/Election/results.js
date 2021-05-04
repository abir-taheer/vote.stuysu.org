import { ForbiddenError } from "apollo-server-micro";

export default (election, _, { user, authenticationRequired }) => {
  if (!election.completed) {
    authenticationRequired();

    if (!user.adminPrivileges) {
      throw new ForbiddenError(
        "At this time you must be an admin to view the results of this election"
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
