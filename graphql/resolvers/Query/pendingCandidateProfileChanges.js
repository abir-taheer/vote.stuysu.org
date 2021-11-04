import ProfileChange from "../../../models/profileChange";

export default (_, __, { adminRequired }) => {
  adminRequired();
  return ProfileChange.find({ reviewed: false });
};
