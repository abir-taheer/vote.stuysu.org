import Election from "../../../models/election";
import fieldsCannotBeEmpty from "../../../utils/user-input/fieldsCannotBeEmpty";
import { ForbiddenError } from "apollo-server-micro";

export default async (
  _,
  { name, url, coverPicId, type, allowedGradYears, start, end },
  { adminRequired }
) => {
  adminRequired();
  fieldsCannotBeEmpty({ name, url, coverPicId });

  if (end < start) {
    throw new ForbiddenError("The start time must be before the end time");
  }

  const existingElection = await Election.findOne({ url });

  if (existingElection) {
    throw new ForbiddenError("There's already an election at that url");
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
