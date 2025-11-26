import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import ProfileChange from "../../../models/profileChange";

export default async (_, { id }, { authenticationRequired, user }) => {
  authenticationRequired();

  const request = await ProfileChange.findById(id);

  if (!id) {
    throw new GraphQLError("There's no profile change request with that ID", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const candidate = await Candidate.findById(request.candidateId);
  if (!candidate) {
    throw new GraphQLError(
      "There's no candidate with the id associated to the request",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  const isManager = candidate.managerIds.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isManager) {
    throw new GraphQLError(
      "You are not a manager for that campaign and cannot make changes to the profile.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  if (request.reviewed) {
    throw new GraphQLError(
      "That request has already been reviewed and cannot be deleted",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  await ProfileChange.deleteOne({
    _id: id,
  });
};
