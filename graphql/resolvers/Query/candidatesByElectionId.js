import escapeStringRegexp from "escape-string-regexp";
import Candidate from "../../../models/candidate";

export default async (_, { electionId, query, sort }) => {
  const words = query.split(/\s/).filter(Boolean);

  const $and = words.map((word) => {
    const regex = new RegExp(escapeStringRegexp(word), "i");
    const $or = [{ name: regex }];

    return { $or };
  });

  const filter = {
    electionId,
  };

  if ($and.length) {
    filter.$and = $and;
  }

  const sortRule = [];

  if (sort === "alphabeticalDesc") {
    sortRule.push(["name", "desc"]);
  } else if (sort === "alphabeticalAsc") {
    sortRule.push(["name", "asc"]);
  }

  const candidates = await Candidate.find(filter).sort(sortRule);

  if (sort === "random") {
    for (let i = 0; i < candidates.length / 2; i++) {
      let swapIndex = Math.floor(Math.random() * candidates.length);
      let temp = candidates[swapIndex];
      candidates[swapIndex] = candidates[i];
      candidates[i] = temp;
    }
  }

  return candidates;
};
