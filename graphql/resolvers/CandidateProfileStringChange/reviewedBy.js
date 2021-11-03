import User from "../../../models/user";

export default (change) =>
  change.reviewedBy ? User.idLoader.load(change.reviewedBy) : null;
