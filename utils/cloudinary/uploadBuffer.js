import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export default function uploadBuffer(file, publicId) {
  return new Promise((resolve, reject) => {
    const fileStream = streamifier.createReadStream(file);

    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: publicId },
      function (err, image) {
        if (err) {
          console.error(err);
        }
        err ? reject(err) : resolve(image);
      }
    );

    fileStream.pipe(uploadStream);
  });
}
