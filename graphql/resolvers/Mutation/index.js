import completeElection from "./completeElection";
import createAnnouncement from "./createAnnouncement";
import createCandidate from "./createCandidate";
import createElection from "./createElection";
import createFAQ from "./createFAQ";
import createUser from "./createUser";
import deleteAnnouncement from "./deleteAnnouncement";
import deleteFAQ from "./deleteFAQ";
import deleteUser from "./deleteUser";
import editAnnouncement from "./editAnnouncement";
import editCandidate from "./editCandidate";
import editElection from "./editElection";
import editFAQ from "./editFAQ";
import editUser from "./editUser";
import login from "./login";
import logout from "./logout";
import openElection from "./openElection";
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
  completeElection,
  createElection,
  createFAQ,
  createUser,
  createCandidate,
  deleteUser,
  editCandidate,
  editElection,
  editFAQ,
  editUser,
  login,
  logout,
  votePlurality,
  voteRunoff,
  syncUsersWithStuyActivities,
};
