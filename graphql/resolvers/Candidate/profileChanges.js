import ProfileChange from "../../../models/profileChange";

export default (candidate) =>
  ProfileChange.candidateIdLoader.load(candidate.id);
