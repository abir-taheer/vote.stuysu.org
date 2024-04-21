import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Candidate from "../../../models/candidate";
import Election from "../../../models/election";
import { renderRunoffVoteEmail } from "../../../utils/mail/templates/renderRunoffVoteEmail";
import { transporter } from "../../../utils/mail/transporter";

export default async (
  _,
  { choices, electionId },
  { authenticationRequired, user }
) => {
  authenticationRequired();

  const election = await Election.findById(electionId);

  if (!election) {
    throw new UserInputError("There's no election with that id");
  }

  election.verifyUserCanVote(user);

  const candidates = await Candidate.idLoader.loadMany(choices);

  const uniqueChoices = new Set(candidates.map((a) => a.id));

  if (uniqueChoices.size !== candidates.length) {
    throw new UserInputError(
      "One or more candidates were ranked more than once on the ballot"
    );
  }

  const everyChoiceValid = candidates.every(
    (c) =>
      Boolean(c) &&
      c.active &&
      c.electionId.toString() === electionId.toString()
  ); // Make sure all of them exist and belong to this election

  if (!everyChoiceValid) {
    throw new ForbiddenError(
      "One or more candidates do not exist or are not running and you may not cast a vote for them"
    );
  }

  const id = Election.nanoid();
  const vote = {
    _id: id,
    gradYear: user.gradYear,
    choices,
  };

  // Randomize the order of user ids to ensure votes can't be traced to emails
  const $position =
    Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50);

  await Election.updateOne(
    { _id: electionId },
    {
      $push: {
        runoffVotes: vote,
        voterIds: {
          $each: [user.id],
          $position,
        },
      },
    }
  );

  try {
    const body = renderRunoffVoteEmail({
      election,
      vote,
      choices: candidates,
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
    choices,
  };
};
