import { UserInputError } from "apollo-server-micro";
import Election from "../../../models/election";
import Picture from "../../../models/picture";

export default async (
  _,
  { name, url, pictureId, type, allowedGradYears, start, end },
  { adminRequired }
) => {
  adminRequired();

  if (end < start) {
    throw new UserInputError("The start time must be before the end time");
  }

  const existingElection = await Election.findOne({ url });

  if (existingElection) {
    throw new UserInputError("There's already an election at that url");
  }

  const coverPic = await Picture.findById(pictureId);

  if (!coverPic) {
    throw new UserInputError("There's no picture with that id");
  }

  return await Election.create({
    name,
    url,
    type,
    start,
    end,
    pictureId,
    allowedGradYears,
    completed: false,
  });
};
