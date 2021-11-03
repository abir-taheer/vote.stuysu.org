export default (change) => {
  if (change.field === "pictureId") {
    return "CandidateProfilePictureChange";
  }

  if (change.field === "blurb" || change.field === "platform") {
    return "CandidateProfileStringChange";
  }
};
