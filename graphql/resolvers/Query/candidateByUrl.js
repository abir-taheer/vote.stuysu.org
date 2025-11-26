import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";

export default async (_, { url, election }) => {
  if (!election.url && !election.id) {
    throw new GraphQLError(
      "An election url or id must be passed to query a candidate by url",
      { extensions: { code: "BAD_USER_INPUT" } }
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
