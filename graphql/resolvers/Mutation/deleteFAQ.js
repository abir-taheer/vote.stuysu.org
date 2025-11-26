import { GraphQLError } from "graphql";
import FAQ from "../../../models/faq";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();
  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new GraphQLError("There's no FAQ with that ID", { extensions: { code: "BAD_USER_INPUT" } });
  }

  await FAQ.deleteOne({ _id: id.toString() });
};
