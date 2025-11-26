import { GraphQLError } from "graphql";
import { parse } from "node-html-parser";
import FAQ from "../../../models/faq";
import sanitizeHtml from "../../../utils/candidate/sanitizeHtml";

export default async (_, { id, title, url, body }, { adminRequired }) => {
  adminRequired();

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new GraphQLError("There's no FAQ with that ID", { extensions: { code: "BAD_USER_INPUT" } });
  }

  faq.title = title;
  faq.url = url;
  faq.body = sanitizeHtml(body);
  faq.plainTextBody = parse(body).innerText;
  faq.updatedAt = new Date();

  await faq.save();

  return faq;
};
