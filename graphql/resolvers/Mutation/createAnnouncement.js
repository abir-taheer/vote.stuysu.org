import { UserInputError } from "apollo-server-micro";
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
      throw new UserInputError(
        "If an announcement is not permanent, start and end must be provided"
      );
    }
  }

  if (!showOnHome && !electionId) {
    throw new UserInputError(
      "If an announcement is not displayed on the home page it must be linked to an election"
    );
  }

  if (electionId) {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new UserInputError("There's no election with that id");
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
