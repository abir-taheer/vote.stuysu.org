import Election from "../../../models/election";

export default (_, { id }) => Election.idLoader.load(id);
