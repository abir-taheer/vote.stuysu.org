import { GraphQLError } from "graphql";
import { randomBytes } from "crypto";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import Picture from "../../../models/picture";
import User from "../../../models/user";
import getDefaultCandidatePic from "../../../utils/candidate/getDefaltCandidatePic";
import sanitizeHtml from "../../../utils/candidate/sanitizeHtml";

const cloudinary = require("cloudinary").v2;

export default async (
  root,
  { electionId, name, blurb, platform, url, managerIds, pictureId },
  { adminRequired, user }
) => {
  adminRequired();

  if (blurb.length > 200) {
    throw new GraphQLError("The blurb must be 200 characters or less", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (platform.length > 10000) {
    throw new GraphQLError(
      "The platform field must be less than 10,000 characters",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  // Make sure the election that the candidate is associated to is valid
  const election = await Election.findById(electionId);
  if (!election) {
    throw new GraphQLError("There's no election with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (election.completed) {
    throw new GraphQLError(
      "That election is closed and new candidates cannot be added",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  // Make sure there's not already another candidate at that url
  const urlIsUsed = await Candidate.exists({ electionId, url });
  if (urlIsUsed) {
    throw new GraphQLError("There's already another candidate at that url", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const managers = await User.idLoader.loadMany(managerIds);
  for (let i = 0; i < managers.length; i++) {
    if (!managers[i]) {
      throw new GraphQLError("There's no user with the id " + managerIds[i], { extensions: { code: "BAD_USER_INPUT" } });
    }
  }

  if (pictureId) {
    const picture = await Picture.findById(pictureId);

    if (!picture) {
      throw new GraphQLError("There's no picture with that id", { extensions: { code: "BAD_USER_INPUT" } });
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

  // Make sure the platform is sanitized before insertion
  platform = sanitizeHtml(platform);

  return await Candidate.create({
    name,
    blurb,
    url,
    electionId,
    pictureId,
    managerIds,
    platform,
    active: true,
    social: {
      facebook: null,
      website: null,
      email: null,
      instagram: null,
    },
  });
};
