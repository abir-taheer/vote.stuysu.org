import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import Picture from "../../../models/picture";
import ProfileChange from "../../../models/profileChange";
import sanitizeHtml from "../../../utils/candidate/sanitizeHtml";

export default async (
  _,
  { candidateId, pictureId, blurb, platform },
  { authenticationRequired, user }
) => {
  authenticationRequired();

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new GraphQLError("There's no candidate with that ID", { extensions: { code: "BAD_USER_INPUT" } });
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

  if (!candidate.active) {
    throw new GraphQLError(
      "That candidate is not active and changes cannot be made to the profile.",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  const election = await Election.findById(candidate.electionId);

  if (!election) {
    throw new GraphQLError("That election does not exist anymore", { extensions: { code: "FORBIDDEN" } });
  }

  if (election.completed) {
    throw new GraphQLError(
      "That election has been completed and changes can no longer be requested",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  const values = { pictureId, blurb, platform };

  const changes = Object.keys(values).filter(
    (key) => typeof values[key] !== "undefined" && values[key] !== null
  );

  if (!changes.length) {
    throw new GraphQLError("No new field value was provided.", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const field = changes[0];

  if (changes.length > 1) {
    throw new GraphQLError(
      "More than one field was provided. A change may only update one field. Make multiple requests to update multiple fields.",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  // Delete any existing unreviewed requests that update this field
  await ProfileChange.deleteMany({
    candidateId,
    field,
    reviewed: false,
  });

  let value;

  if (field === "pictureId") {
    const picture = await Picture.findById(pictureId);

    if (!picture) {
      throw new GraphQLError("That picture ID is not valid", { extensions: { code: "BAD_USER_INPUT" } });
    }

    value = pictureId;
  }

  if (field === "blurb") {
    if (blurb.length > 200) {
      throw new GraphQLError("The blurb must be 200 characters or less", { extensions: { code: "BAD_USER_INPUT" } });
    }

    value = blurb;
  }

  if (field === "platform") {
    platform = sanitizeHtml(platform);

    if (platform.length > 10000) {
      throw new GraphQLError(
        "The platform field must be less than 10,000 characters",
        { extensions: { code: "BAD_USER_INPUT" } }
      );
    }

    value = platform;
  }

  return await ProfileChange.create({
    field,
    value,
    candidateId,
    createdBy: user.id,
  });
};
