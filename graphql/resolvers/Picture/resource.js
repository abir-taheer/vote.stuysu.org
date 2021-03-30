import CloudinaryResource from "../../../models/cloudinaryResource";

export default (picture) =>
  CloudinaryResource.idLoader.load(picture.resourceId);
