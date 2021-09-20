import escapeStringRegexp from "escape-string-regexp";
import mongoose from "./../../mongoose";

export default async ({ page, resultsPerPage, query, filters }) => {
  const offset = (page - 1) * resultsPerPage;

  const words = query.split(/\s/).filter(Boolean);

  const adminFilterIndex = words.indexOf(":admin");
  const onlyAdmin = adminFilterIndex !== -1;

  if (onlyAdmin) {
    words.splice(adminFilterIndex, 1);
  }

  const $and = words.map((word) => {
    const regex = new RegExp(escapeStringRegexp(word), "i");
    const $or = [{ firstName: regex }, { lastName: regex }, { email: regex }];

    return { $or };
  });

  if (onlyAdmin) {
    $and.push({
      adminPrivileges: true,
    });
  }

  const filter = { ...filters };

  if ($and.length) {
    filter.$and = $and;
  }

  const User = mongoose.model("User");

  const results = await User.find(filter)
    .sort([
      ["gradYear", "desc"],
      ["firstName", "asc"],
      ["lastName", "asc"],
      ["email", "asc"],
    ])
    .skip(offset)
    .limit(resultsPerPage);

  const total = await User.countDocuments(filter);
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
