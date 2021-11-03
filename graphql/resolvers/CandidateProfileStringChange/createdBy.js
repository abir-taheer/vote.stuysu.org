import User from "../../../models/user";

export default (change) => User.idLoader.load(change.createdBy);
