import { v2 as cloudinary } from "cloudinary";

export default function url(resource) {
  return cloudinary.url(resource._id, {
    secure: true,
    format: resource.format === "svg" ? "png" : resource.format,
  });
}
