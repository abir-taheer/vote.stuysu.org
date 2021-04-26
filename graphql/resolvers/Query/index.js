import authenticatedUser from "./authenticatedUser";
import allElections from "./allElections";
import electionById from "./electionById";
import electionByUrl from "./electionByUrl";
import openElections from "./openElections";
import pastElections from "./pastElections";
import adminPictures from "./adminPictures";
import pictureById from "./pictureById";
import date from "./date";
import candidateById from "./candidateById";
import candidateByUrl from "./candidateByUrl";
import allUsers from "./allUsers";
import publicKey from "./publicKey";
import userById from "./userById";
import usersById from "./usersById";
import candidatesByElectionId from "./candidatesByElectionId";
import userHasVoted from "./userHasVoted";

const Query = {
  adminPictures,
  allUsers,
  userById,
  usersById,
  allElections,
  authenticatedUser,
  candidateById,
  candidateByUrl,
  candidatesByElectionId,
  userHasVoted,
  electionById,
  electionByUrl,
  openElections,
  pastElections,
  pictureById,
  date,
  publicKey,
};

export default Query;
