import User from "../../../models/user";

export default (_, { ids }) => User.idLoader.loadMany(ids);
