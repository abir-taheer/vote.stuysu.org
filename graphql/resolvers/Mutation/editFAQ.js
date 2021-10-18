import { UserInputError } from "apollo-server-micro";
import { parse } from "node-html-parser";
import FAQ from "../../../models/faq";
import sanitizeHtml from "../../../utils/candidate/sanitizeHtml";

export default async (_, { id, title, url, body }, { adminRequired }) => {
  adminRequired();

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new UserInputError("There's no FAQ with that ID");
  }

  faq.title = title;
  faq.url = url;
  faq.body = sanitizeHtml(body);
  faq.plainTextBody = parse(body).innerText;
  faq.updatedAt = new Date();

  await faq.save();

  return faq;
};
