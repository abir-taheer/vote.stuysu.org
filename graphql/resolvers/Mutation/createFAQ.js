import { UserInputError } from "apollo-server-micro";
import { parse } from "node-html-parser";
import FAQ from "../../../models/faq";

export default async (_, { title, url, body }, { adminRequired }) => {
  adminRequired();

  // make sure the url isn't already used

  const existing = await FAQ.findOne({ url });

  if (existing) {
    throw new UserInputError("There's already another FAQ with that url");
  }

  const bodyTree = parse(body);

  const plainTextBody = bodyTree.innerText;

  const createdAt = new Date();
  const updatedAt = new Date();

  return await FAQ.create({
    title,
    url,
    body,
    plainTextBody,
    createdAt,
    updatedAt,
  });
};
