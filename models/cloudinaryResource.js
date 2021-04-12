import mongoose from "./mongoose";
import cloudinaryIdLoader from "./statics/cloudinaryResource/idLoader";

const CloudinaryResourceSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  assetId: String,
  width: Number,
  height: Number,
  format: String,
  resourceType: String,
  createdAt: Date,
});

CloudinaryResourceSchema.statics.idLoader = cloudinaryIdLoader;

const CloudinaryResource =
  mongoose.models.CloudinaryResource ||
  mongoose.model("CloudinaryResource", CloudinaryResourceSchema);

export default CloudinaryResource;
