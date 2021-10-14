import mongoose from "../../mongoose";

export default async function calculatePluralityResults() {
  let votes = this.pluralityVotes;

  if (!votes) {
    const election = await mongoose
      .model("Election")
      .findOne({ _id: this._id })
      .select("+pluralityVotes")
      .exec();

    votes = election.pluralityVotes || [];
  }

  const totalVotes = votes.length;
  const numEligibleVoters = await this.getNumEligibleVoters();
  let winnerId = null;
  let isTie = false;

  const candidates = await mongoose
    .model("Candidate")
    .find({ electionId: this._id });

  const candidateVoteMap = {};

  candidates.forEach((candidate) => {
    candidateVoteMap[candidate._id] = 0;
  });

  let mostVotes = 0;

  votes.forEach((vote) => {
    const numVotes = ++candidateVoteMap[vote.choice];

    if (numVotes === mostVotes) {
      isTie = true;
      winnerId = null;
    }

    if (numVotes > mostVotes) {
      isTie = false;
      mostVotes = numVotes;
      winnerId = vote.choice;
    }
  });

  const candidateResults = candidates.map((candidate) => {
    const numVotes = candidateVoteMap[candidate.id];
    const rawPercentage = totalVotes > 0 ? numVotes / totalVotes : 0;

    return {
      candidateId: candidate.id,
      percentage: Math.round(rawPercentage * 10000) / 100,
      numVotes,
    };
  });

  return {
    candidateResults,
    winnerId,
    isTie,
    totalVotes,
    numEligibleVoters,
  };
}
