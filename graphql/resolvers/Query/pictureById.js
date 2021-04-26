import Picture from "../../../models/picture";

export default (_, { id }) => Picture.idLoader.load(id);
