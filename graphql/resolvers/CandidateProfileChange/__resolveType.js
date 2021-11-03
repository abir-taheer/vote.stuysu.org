export default (change) => {
  if (change.field === "picture") {
    return "CandidateProfilePictureChange";
  }

  if (change.field === "blurb" || change.field === "platform") {
    return "CandidateProfileStringChange";
  }
};
