import { ForbiddenError } from "apollo-server-micro";

export default function verifyUserCanVote(user) {
  if (!this.isVotingPeriod()) {
    throw new ForbiddenError("It is not the voting period for this election");
  }

  if (this.completed) {
    throw new ForbiddenError(
      "This election is no longer open and new votes cannot be added"
    );
  }

  const canVote = this.allowedGradYears.includes(user.gradYear);

  if (!canVote) {
    throw new ForbiddenError("You are not allowed to vote for this election");
  }

  const hasVoted = this.voterIds.includes(user.id);

  if (hasVoted) {
    throw new ForbiddenError("You've already voted for this election");
  }
}
