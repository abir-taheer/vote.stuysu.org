import { UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";

export default async (_, { url, election }) => {
  if (!election.url && !election.id) {
    throw new UserInputError(
      "An election url or id must be passed to query a candidate by url"
    );
  }

  if (election.id) {
    return Candidate.findOne({ url, electionId: election.id });
  }

  if (election.url) {
    const el = await Election.findByUrl(election.url);

    if (el) {
      return Candidate.findOne({ url, electionId: el.id });
    }
  }
};
