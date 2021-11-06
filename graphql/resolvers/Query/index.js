import adminPictures from "./adminPictures";
import allAnnouncements from "./allAnnouncements";
import allElections from "./allElections";
import allFAQs from "./allFAQs";
import allUsers from "./allUsers";
import allVoters from "./allVoters";
import allVotes from "./allVotes";
import announcementById from "./announcementById";
import authenticatedUser from "./authenticatedUser";
import candidateById from "./candidateById";
import candidateByUrl from "./candidateByUrl";
import candidatesByElectionId from "./candidatesByElectionId";
import candidatesManagedByAuthenticatedUser from "./candidatesManagedByAuthenticatedUser";
import currentElections from "./currentElections";
import date from "./date";
import electionById from "./electionById";
import electionByUrl from "./electionByUrl";
import electionResults from "./electionResults";
import faqById from "./faqById";
import faqByUrl from "./faqByUrl";
import openElections from "./openElections";
import pastElections from "./pastElections";
import pendingCandidateProfileChanges from "./pendingCandidateProfileChanges";
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
  allFAQs,
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
  candidatesManagedByAuthenticatedUser,
  currentElections,
  pendingCandidateProfileChanges,
  userHasVoted,
  electionById,
  electionByUrl,
  electionResults,
  faqById,
  faqByUrl,
  openElections,
  pastElections,
  pictureById,
  date,
  publicKey,
};

export default Query;
