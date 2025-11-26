import { GraphQLError } from "graphql";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import { renderPluralityVoteEmail } from "../../../utils/mail/templates/renderPluralityVoteEmail";
import { transporter } from "../../../utils/mail/transporter";

export default async (
  _,
  { candidateId, electionId },
  { authenticationRequired, user }
) => {
  authenticationRequired();

  const election = await Election.findById(electionId);

  if (!election) {
    throw new GraphQLError("There's no election with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }
  election.verifyUserCanVote(user);

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new GraphQLError("There is no candidate with that id", { extensions: { code: "BAD_USER_INPUT" } });
  }

  if (!candidate.active) {
    throw new GraphQLError(
      "That candidate is not running and you may not cast a vote for them",
      { extensions: { code: "FORBIDDEN" } }
    );
  }

  if (candidate.electionId.toString() !== electionId.toString()) {
    throw new GraphQLError("That candidate is not running in this election", { extensions: { code: "FORBIDDEN" } });
  }

  const id = Election.nanoid();
  const vote = {
    _id: id,
    gradYear: user.gradYear,
    choice: candidate.id,
  };

  // Randomize the order of user ids to ensure votes can't be traced to emails
  const $position =
    Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50);

  await Election.updateOne(
    { _id: electionId },
    {
      $push: {
        pluralityVotes: vote,
        voterIds: {
          $each: [user.id],
          $position,
        },
      },
    }
  );

  try {
    const body = renderPluralityVoteEmail({
      election,
      vote,
      choice: candidate,
    });

    await transporter.sendMail({
      from: '"StuyBOE Mailer" <no-reply@vote.stuysu.org>', // sender address
      to: user.email,
      subject: `Vote Confirmation | ${election.name}`, // Subject line
      html: body,
    });
  } catch (e) {}

  return {
    id,
    gradYear: user.gradYear,
    choice: candidate.id,
  };
};
