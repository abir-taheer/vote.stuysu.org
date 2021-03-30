import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  alt: String,
  resourceId: String,
  uploadedBy: Schema.Types.ObjectId,
});

const Picture =
  mongoose.models.Picture || mongoose.model("Picture", PictureSchema);

PictureSchema.statics.idLoader = findOneLoaderFactory("Picture");

export default Picture;
