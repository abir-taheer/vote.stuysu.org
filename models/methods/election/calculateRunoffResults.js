import mongoose from "./../../mongoose";

export default async function calculateRunoffResults() {
  let votes = this.runoffVotes;
  if (!votes) {
    let election = await mongoose
      .model("Election")
      .findById(this.id)
      .select("+runoffVotes")
      .exec();

    votes = election.runoffVotes || [];
  }

  const numEligibleVoters = await this.getNumEligibleVoters();
  const candidates = await mongoose
    .model("Candidate")
    .find({ electionId: this.id });

  const rounds = [];
  let winnerId = null;
  let isTie = false;
  let totalVotes = votes.length;

  const eliminated = [];

  if (votes.length > 0) {
    let complete = false;
    let number = 0;
    while (!complete) {
      number++;
      let numVotesThisRound = 0;

      let voteCountsThisRound = {};

      if (number === 1) {
        candidates.forEach((candidate) => {
          voteCountsThisRound[candidate._id] = 0;
        });
      }

      const eliminatedThisRound = [];

      votes.forEach((vote) => {
        const activeVote = vote.choices.find(
          (choice) => !eliminated.includes(choice)
        );

        if (activeVote) {
          numVotesThisRound++;
          // init counter if not already done this round
          if (!voteCountsThisRound[activeVote]) {
            voteCountsThisRound[activeVote] = 0;
          }

          voteCountsThisRound[activeVote]++;
        }
      });

      const candidateIdsThisRound = Object.keys(voteCountsThisRound);

      let minVotes = voteCountsThisRound[candidateIdsThisRound[0]];

      candidateIdsThisRound.forEach((candidateId) => {
        const currentCandidateNumVotes = voteCountsThisRound[candidateId];

        if (currentCandidateNumVotes < minVotes) {
          minVotes = currentCandidateNumVotes;
        }
      });

      const results = candidateIdsThisRound.map((id) => {
        const candidateNumVotesThisRound = voteCountsThisRound[id];
        const isEliminated = candidateNumVotesThisRound === minVotes;
        const percentage =
          numVotesThisRound > 0
            ? Math.round(
                (candidateNumVotesThisRound * 10000) / numVotesThisRound
              ) / 100
            : 0;

        if (isEliminated) {
          eliminated.push(id);
          eliminatedThisRound.push(id);
        }

        if (percentage >= 50) {
          if (winnerId) {
            // This means a tie
            winnerId = null;
            complete = false;
            isTie = true;
          } else {
            winnerId = id;
            complete = true;
            isTie = false;
          }
        }

        return {
          candidateId: id,
          eliminated: isEliminated,
          percentage,
          numVotes: candidateNumVotesThisRound,
        };
      });

      if (numVotesThisRound) {
        results.sort((a, b) => b.numVotes - a.numVotes);

        rounds.push({
          number,
          numVotes: numVotesThisRound,
          results,
          eliminatedCandidateIds: eliminatedThisRound,
        });
      } else {
        complete = true;
      }
    }
  }

  return {
    rounds,
    winnerId,
    totalVotes,
    isTie,
    numEligibleVoters,
  };
}
