import { GraphQLError } from "graphql";
import Announcement from "../../../models/announcement";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new GraphQLError("There's no announcement with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  await announcement.delete();
};
