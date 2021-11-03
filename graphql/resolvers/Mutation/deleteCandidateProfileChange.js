import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";
import ProfileChange from "../../../models/profileChange";

export default async (_, { id }, { authenticationRequired, user }) => {
  authenticationRequired();

  const request = await ProfileChange.findById(id);

  if (!id) {
    throw new UserInputError("There's no profile change request with that ID");
  }

  const candidate = await Candidate.findById(request.candidateId);
  if (!candidate) {
    throw new UserInputError(
      "There's no candidate with the id associated to the request"
    );
  }

  const isManager = candidate.managerIds.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isManager) {
    throw new ForbiddenError(
      "You are not a manager for that campaign and cannot make changes to the profile."
    );
  }

  if (request.reviewed) {
    throw new ForbiddenError(
      "That request has already been reviewed and cannot be deleted"
    );
  }

  await ProfileChange.deleteOne({
    _id: id,
  });
};
