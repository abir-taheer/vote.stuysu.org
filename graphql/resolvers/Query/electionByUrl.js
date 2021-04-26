import Election from "../../../models/election";

export default (_, { url }) => Election.urlLoader.load(url);
