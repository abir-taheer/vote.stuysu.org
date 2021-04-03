import Picture from "../../../models/picture";

export default (_, { id }) => Picture.findById(id);
