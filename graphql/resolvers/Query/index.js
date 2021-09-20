import adminPictures from "./adminPictures";
import allAnnouncements from "./allAnnouncements";
import allElections from "./allElections";
import allUsers from "./allUsers";
import allVoters from "./allVoters";
import allVotes from "./allVotes";
import announcementById from "./announcementById";
import authenticatedUser from "./authenticatedUser";
import candidateById from "./candidateById";
import candidateByUrl from "./candidateByUrl";
import candidatesByElectionId from "./candidatesByElectionId";
import date from "./date";
import electionById from "./electionById";
import electionByUrl from "./electionByUrl";
import electionResults from "./electionResults";
import openElections from "./openElections";
import pastElections from "./pastElections";
import pictureById from "./pictureById";
import publicKey from "./publicKey";
import userById from "./userById";
import userHasVoted from "./userHasVoted";
import userIsDeletable from "./userIsDeletable";
import usersById from "./usersById";

const Query = {
  announcementById,
  adminPictures,
  allAnnouncements,
  allUsers,
  allVotes,
  allVoters,
  userById,
  usersById,
  userIsDeletable,
  allElections,
  authenticatedUser,
  candidateById,
  candidateByUrl,
  candidatesByElectionId,
  userHasVoted,
  electionById,
  electionByUrl,
  electionResults,
  openElections,
  pastElections,
  pictureById,
  date,
  publicKey,
};

export default Query;
