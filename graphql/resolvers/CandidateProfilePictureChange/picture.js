import Picture from "../../../models/picture";

export default (change) => Picture.idLoader.load(change.value);
