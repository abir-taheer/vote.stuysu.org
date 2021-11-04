import Candidate from "../../../models/candidate";

export default async (_, __, { user, signedIn }) => {
  if (!signedIn) {
    return null;
  }

  return Candidate.find({
    managerIds: user.id,
  });
};
