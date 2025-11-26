import { GraphQLError } from "graphql";

export default function verifyUserCanVote(user) {
  if (!this.isVotingPeriod()) {
    throw new GraphQLError("It is not the voting period for this election", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  if (this.completed) {
    throw new GraphQLError(
      "This election is no longer open and new votes cannot be added",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  const canVote = this.allowedGradYears.includes(user.gradYear);

  if (!canVote) {
    throw new GraphQLError("You are not allowed to vote for this election", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  const hasVoted = this.voterIds.includes(user.id);

  if (hasVoted) {
    throw new GraphQLError("You've already voted for this election", {
      extensions: { code: "FORBIDDEN" },
    });
  }
}
