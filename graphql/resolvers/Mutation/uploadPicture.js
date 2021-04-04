import Picture from "../../../models/picture";
import uploadPicStream from "../../../utils/cloudinary/uploadPicStream";
import { randomBytes } from "crypto";
import Election from "../../../models/election";
import Candidate from "../../../models/candidate";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";

import fs from "fs";

// Only admins and campaign managers should be able to upload pictures at this time
export default async (
  _,
  { alt, file },
  { authenticationRequired, adminRequired, user }
) => {
  authenticationRequired();

  fieldsCannotBeEmpty({ alt });
  const openElections = await Election.find({ completed: false });

  const idsOfOpenElections = openElections.map((e) => e.id);

  const candidateManaged = await Candidate.findOne({
    electionId: { $in: idsOfOpenElections },
    managerIds: user.id,
  });

  if (!candidateManaged) {
    adminRequired();
  }

  // Now that the validation is complete we can actually upload the image
  let publicId;

  const randString = randomBytes(8).toString("hex");

  if (user.adminPrivileges) {
    publicId = "admin/" + randString;
  } else {
    publicId = candidateManaged.url + "/" + randString;
  }

  file = await file;

  const resource = await uploadPicStream(file, publicId);

  return await Picture.create({
    alt,
    resourceId: resource.public_id,
    uploadedBy: user.id,
  });
};
