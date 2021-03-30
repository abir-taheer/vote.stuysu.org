import Election from "../../../models/election";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import { UserInputError } from "apollo-server-micro";
import Picture from "../../../models/picture";

export default async (
  _,
  { name, url, coverPicId, type, allowedGradYears, start, end },
  { adminRequired }
) => {
  adminRequired();
  fieldsCannotBeEmpty({ name, url, coverPicId });

  if (end < start) {
    throw new UserInputError("The start time must be before the end time");
  }

  const existingElection = await Election.findOne({ url });

  if (existingElection) {
    throw new UserInputError("There's already an election at that url");
  }

  const coverPic = await Picture.findById(coverPicId);

  if (!coverPic) {
    throw new UserInputError("There's no picture with that id");
  }

  return await Election.create({
    name,
    url,
    type,
    start,
    end,
    coverPicId,
    allowedGradYears,
    completed: false,
  });
};
