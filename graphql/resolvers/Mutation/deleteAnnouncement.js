import Announcement from "../../../models/announcement";
import { UserInputError } from "apollo-server-micro";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new UserInputError("There's no announcement with that id");
  }

  await announcement.delete();
};
