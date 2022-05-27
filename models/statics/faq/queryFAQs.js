import escapeStringRegexp from "escape-string-regexp";
import mongoose from "./../../mongoose";

const queryFAQs = async ({ page, resultsPerPage, query, filters }) => {
  const offset = (page - 1) * resultsPerPage;

  const words = query.split(/\s/).filter(Boolean);

  const $and = words.map((word) => {
    const regex = new RegExp(escapeStringRegexp(word), "i");
    const $or = [{ title: regex }, { url: regex }, { plainTextBody: regex }];

    return { $or };
  });

  const filter = { ...filters };

  if ($and.length) {
    filter.$and = $and;
  }

  const FAQ = mongoose.model("FAQ");

  const results = await FAQ.find(filter)
    .sort([
      ["title", "desc"],
      ["updatedAt", "asc"],
    ])
    .skip(offset)
    .limit(resultsPerPage);

  const total = await FAQ.countDocuments(filter);
  const numPages = Math.ceil(total / resultsPerPage);

  const hasNextPage = page * resultsPerPage < total;
  const hasPreviousPage = offset - resultsPerPage >= 0;

  return {
    page: total ? page : 0,
    total,
    hasNextPage,
    hasPreviousPage,
    numPages,
    resultsPerPage,
    results,
  };
};

export default queryFAQs;
