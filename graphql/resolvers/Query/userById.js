import User from "../../../models/user";

export default (_, { id }) => User.idLoader.load(id);
