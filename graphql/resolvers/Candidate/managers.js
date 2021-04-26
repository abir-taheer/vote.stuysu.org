import User from "../../../models/user";

export default (candidate) => User.idLoader.loadMany(candidate.managerIds);
