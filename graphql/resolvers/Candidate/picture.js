import Picture from "../../../models/picture";

export default (candidate) => Picture.idLoader.load(candidate.pictureId);
