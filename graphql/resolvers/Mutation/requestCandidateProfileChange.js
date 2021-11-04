import { ForbiddenError, UserInputError } from "apollo-server-micro";
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
    throw new UserInputError("There's no candidate with that ID");
  }

  const isManager = candidate.managerIds.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isManager) {
    throw new ForbiddenError(
      "You are not a manager for that campaign and cannot make changes to the profile."
    );
  }

  if (!candidate.active) {
    throw new ForbiddenError(
      "That candidate is not active and changes cannot be made to the profile."
    );
  }

  const election = await Election.findById(candidate.electionId);

  if (!election) {
    throw new ForbiddenError("That election does not exist anymore");
  }

  if (election.completed) {
    throw new ForbiddenError(
      "That election has been completed and changes can no longer be requested"
    );
  }

  const values = { pictureId, blurb, platform };

  const changes = Object.keys(values).filter(
    (key) => typeof values[key] !== "undefined" && values[key] !== null
  );

  if (!changes.length) {
    throw new UserInputError("No new field value was provided.");
  }

  const field = changes[0];

  if (changes.length > 1) {
    throw new UserInputError(
      "More than one field was provided. A change may only update one field. Make multiple requests to update multiple fields."
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
      throw new UserInputError("That picture ID is not valid");
    }

    value = pictureId;
  }

  if (field === "blurb") {
    if (blurb.length > 200) {
      throw new UserInputError("The blurb must be 200 characters or less");
    }

    value = blurb;
  }

  if (field === "platform") {
    platform = sanitizeHtml(platform);

    if (platform.length > 10000) {
      throw new UserInputError(
        "The platform field must be less than 10,000 characters"
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
