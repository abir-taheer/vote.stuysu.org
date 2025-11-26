import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import ProfileChange from "../../../models/profileChange";

export default async (
  _,
  { id, approved, reasonForRejection },
  { adminRequired, user }
) => {
  adminRequired();

  const request = await ProfileChange.findById(id);

  if (!request) {
    throw new GraphQLError("There's no profile change request with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (request.reviewed) {
    throw new GraphQLError(
      "That request has already been reviewed. Ask the candidate to make another request if necessary.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  if (approved) {
    const candidate = await Candidate.findById(request.candidateId);

    if (!candidate) {
      throw new GraphQLError("There's no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
    }
    candidate[request.field] = request.value;

    await candidate.save();
  }

  request.reviewed = true;
  request.approved = approved;
  request.reasonForRejection = reasonForRejection || "";
  request.reviewedAt = new Date();
  request.reviewedBy = user.id;
  await request.save();

  return request;
};
