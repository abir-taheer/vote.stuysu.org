import Election from "../../../models/election";
import { ForbiddenError, UserInputError } from "apollo-server-micro";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import Candidate from "../../../models/candidate";
import Picture from "../../../models/picture";
import getDefaultCandidatePic from "../../../utils/candidate/getDefaltCandidatePic";
import { randomBytes } from "crypto";
import User from "../../../models/user";

const cloudinary = require("cloudinary").v2;

export default async (
  root,
  { electionId, name, blurb, platform, url, managerIds, pictureId },
  { adminRequired, user }
) => {
  adminRequired();

  fieldsCannotBeEmpty({ name, url });

  if (blurb.length > 200) {
    throw new UserInputError("The blurb must be 200 characters or less");
  }

  if (platform.length > 10000) {
    throw new UserInputError(
      "The platform field must be less than 10,000 characters"
    );
  }

  // Make sure the election that the candidate is associated to is valid
  const election = await Election.findById(electionId);
  if (!election) {
    throw new UserInputError("There's no election with that id");
  }

  if (election.completed) {
    throw new ForbiddenError(
      "That election is closed and new candidates cannot be added"
    );
  }

  // Make sure there's not already another candidate at that url
  const urlIsUsed = await Candidate.exists({ electionId, url });
  if (urlIsUsed) {
    throw new UserInputError("There's already another candidate at that url");
  }

  const managers = await User.idLoader.loadMany(managerIds);
  for (let i = 0; i < managers.length; i++) {
    if (!managers[i]) {
      throw new UserInputError("There's no user with the id " + managerIds[i]);
    }
  }

  if (pictureId) {
    const picture = await Picture.findById(pictureId);

    if (!picture) {
      throw new UserInputError("There's no picture with that id");
    }
  }

  if (!pictureId) {
    const publicId = "initialPics/" + randomBytes(4).toString("hex");
    await cloudinary.uploader.upload(getDefaultCandidatePic(url), {
      public_id: publicId,
    });

    const picture = await Picture.create({
      alt: "Initials of the candidate on a colored background",
      resourceId: publicId,
      uploadedBy: user.id,
    });

    pictureId = picture.id;
  }

  return await Candidate.create({
    name,
    blurb,
    platform,
    url,
    electionId,
    pictureId,
    managerIds,
    active: true,
    social: {
      facebook: null,
      website: null,
      email: null,
      instagram: null,
    },
  });
};
