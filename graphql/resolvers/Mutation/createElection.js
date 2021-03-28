import Election from "../../../models/election";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import { ForbiddenError } from "apollo-server-micro";
import CloudinaryResource from "../../../models/cloudinaryResource";

export default async (
  _,
  { name, url, coverPicId, type, allowedGradYears },
  { adminRequired }
) => {
  adminRequired();
  fieldsCannotBeEmpty({ name, url, coverPicId });

  const existingElection = await Election.findOne({ url });

  if (existingElection) {
    throw new ForbiddenError("There's already an election at that url");
  }

  return await Election.create({
    name,
    url,
    type,
    coverPicId,
    allowedGradYears,
  });
};
