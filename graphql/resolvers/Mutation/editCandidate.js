import { UserInputError } from "apollo-server-micro";
import { randomBytes } from "crypto";
import Candidate from "../../../models/candidate";
import Picture from "../../../models/picture";
import User from "../../../models/user";
import getDefaultCandidatePic from "../../../utils/candidate/getDefaltCandidatePic";
import sanitizeHtml from "../../../utils/candidate/sanitizeHtml";

const cloudinary = require("cloudinary").v2;

export default async (
  _,
  { id, name, url, blurb, platform, managerIds, pictureId },
  { adminRequired, user }
) => {
  adminRequired();

  if (blurb.length > 200) {
    throw new UserInputError("The blurb must be 200 characters or less");
  }

  if (platform.length > 10000) {
    throw new UserInputError(
      "The platform field must be less than 10,000 characters"
    );
  }

  const candidate = await Candidate.findById(id);
  if (!candidate) {
    throw new UserInputError("There's no candidate with that id");
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

  const managers = await User.idLoader.loadMany(managerIds);
  for (let i = 0; i < managers.length; i++) {
    if (!managers[i]) {
      throw new UserInputError("There's no user with the id " + managerIds[i]);
    }
  }

  if (url !== candidate.url) {
    const urlIsUsed = await Candidate.exists({
      url,
      electionId: candidate.electionId,
    });

    if (urlIsUsed) {
      throw new UserInputError("There's already another candidate at that url");
    }
  }

  platform = sanitizeHtml(platform);

  candidate.name = name;
  candidate.url = url;
  candidate.platform = platform;
  candidate.blurb = blurb;
  candidate.pictureId = pictureId;
  candidate.managerIds = managerIds;

  await candidate.save();

  return candidate;
};
