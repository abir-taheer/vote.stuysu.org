import { v2 as cloudinary } from "cloudinary";

export default (resource) => {
  return cloudinary.url(resource._id, {
    secure: true,
  });
};
