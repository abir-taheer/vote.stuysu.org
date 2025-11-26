import { GraphQLError } from "graphql";
import Announcement from "../../../models/announcement";
import Election from "../../../models/election";

export default async (
  _,
  { id, title, body, start, end, permanent, showOnHome, electionId },
  { adminRequired }
) => {
  adminRequired();

  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new GraphQLError("There's no announcement with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (!permanent) {
    if (!start || !end) {
      throw new GraphQLError(
        "If an announcement is not permanent, start and end must be provided",
        { extensions: { code: "BAD_USER_INPUT" } }
      );
    }
  }

  if (!showOnHome && !electionId) {
    throw new GraphQLError(
      "If an announcement is not displayed on the home page it must be linked to an election",
      { extensions: { code: "BAD_USER_INPUT" } }
    );
  }

  if (electionId) {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new GraphQLError("There's no election with that id", { extensions: { code: "BAD_USER_INPUT" } });
    }
  }

  announcement.title = title;
  announcement.body = body;
  announcement.start = start;
  announcement.end = end;
  announcement.permanent = permanent;
  announcement.showOnHome = showOnHome;
  announcement.electionId = electionId;
  announcement.updatedAt = new Date();
  await announcement.save();

  return announcement;
};
