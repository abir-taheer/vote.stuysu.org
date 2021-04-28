import Candidate from "../../../models/candidate";

export default async (election, { sort }) => {
  if (sort === "alphabeticalAsc") {
    return await Candidate.ascElectionIdLoader.load(election.id);
  } else if (sort === "alphabeticalDesc") {
    return await Candidate.descElectionIdLoader.load(election.id);
  }

  // Else we're sorting randomly
  const candidates = await Candidate.electionIdLoader.load(election.id);

  for (let i = 0; i < candidates.length / 2; i++) {
    const swapIndex = Math.floor(Math.random() * candidates.length);
    const temp = candidates[swapIndex];
    candidates[swapIndex] = candidates[i];
    candidates[i] = temp;
  }
  return candidates;
};
