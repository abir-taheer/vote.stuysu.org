import { GraphQLError } from "graphql";
import Election from "../../../models/election";
import Picture from "../../../models/picture";

export default async (
  _,
  { name, url, pictureId, type, allowedGradYears, start, end },
  { adminRequired }
) => {
  adminRequired();

  if (end < start) {
    throw new GraphQLError("The start time must be before the end time", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const existingElection = await Election.findOne({ url });

  if (existingElection) {
    throw new GraphQLError("There's already an election at that url", { extensions: { code: "BAD_USER_INPUT" } });
  }

  const coverPic = await Picture.findById(pictureId);

  if (!coverPic) {
    throw new GraphQLError("There's no picture with that id", { extensions: { code: "BAD_USER_INPUT" } });
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
