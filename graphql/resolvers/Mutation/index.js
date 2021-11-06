import completeElection from "./completeElection";
import createAnnouncement from "./createAnnouncement";
import createCandidate from "./createCandidate";
import createElection from "./createElection";
import createFAQ from "./createFAQ";
import createStrike from "./createStrike";
import createUser from "./createUser";
import deleteAnnouncement from "./deleteAnnouncement";
import deleteCandidate from "./deleteCandidate";
import deleteCandidateProfileChange from "./deleteCandidateProfileChange";
import deleteElection from "./deleteElection";
import deleteFAQ from "./deleteFAQ";
import deleteStrike from "./deleteStrike";
import deleteUser from "./deleteUser";
import editAnnouncement from "./editAnnouncement";
import editCandidate from "./editCandidate";
import editElection from "./editElection";
import editFAQ from "./editFAQ";
import editStrike from "./editStrike";
import editUser from "./editUser";
import login from "./login";
import logout from "./logout";
import openElection from "./openElection";
import requestCandidateProfileChange from "./requestCandidateProfileChange";
import reviewCandidateProfileChange from "./reviewCandidateProfileChange";
import setCandidateActive from "./setCandidateActive";
import syncUsersWithStuyActivities from "./syncUsersWithStuyActivities";
import votePlurality from "./votePlurality";
import voteRunoff from "./voteRunoff";

export default {
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  deleteFAQ,
  openElection,
  setCandidateActive,
  createStrike,
  editStrike,
  deleteStrike,
  completeElection,
  deleteElection,
  createElection,
  createFAQ,
  createUser,
  createCandidate,
  deleteUser,
  deleteCandidate,
  deleteCandidateProfileChange,
  editCandidate,
  editElection,
  requestCandidateProfileChange,
  reviewCandidateProfileChange,
  editFAQ,
  editUser,
  login,
  logout,
  votePlurality,
  voteRunoff,
  syncUsersWithStuyActivities,
};
