import { GraphQLError } from "graphql";
import Announcement from "../../../models/announcement";
import Election from "../../../models/election";

export default async (
  _,
  { title, body, start, end, permanent, showOnHome, electionId },
  { adminRequired }
) => {
  adminRequired();

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

  const updatedAt = new Date();

  return await Announcement.create({
    title,
    body,
    start,
    end,
    permanent,
    electionId,
    showOnHome,
    updatedAt,
  });
};
