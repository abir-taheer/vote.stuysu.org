import { v2 as cloudinary } from "cloudinary";

const safeFormats = new Set(["jpg", "jpeg", "png", "gif", "webp"]);

export default function url(resource) {
  return cloudinary.url(resource._id, {
    secure: true,
    format: safeFormats.has(resource.format) ? resource.format : "gif",
  });
}
