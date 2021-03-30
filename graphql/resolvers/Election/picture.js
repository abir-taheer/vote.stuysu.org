import Picture from "../../../models/picture";

export default (election) => Picture.idLoader.load(election.pictureId);
