import { UserInputError } from "apollo-server-micro";
import Announcement from "../../../models/announcement";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import ProfileChange from "../../../models/profileChange";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();
  const election = await Election.findById(id);

  if (!election) {
    throw new UserInputError("There's no election with that id");
  }

  const candidates = await Candidate.find({
    electionId: id,
  });

  for (let i = 0; i < candidates.length; i++) {
    await ProfileChange.deleteMany({
      candidateId: candidates[i].id,
    });
  }

  await Candidate.deleteMany({ electionId: id });
  await Announcement.deleteMany({ electionId: id });

  await Election.deleteOne({ _id: id });
};
