import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  alt: String,
  resourceId: String,
  uploadedBy: Schema.Types.ObjectID,
});

PictureSchema.statics.idLoader = findOneLoaderFactory("Picture");

const Picture =
  mongoose.models.Picture || mongoose.model("Picture", PictureSchema);

PictureSchema.statics.idLoader = findOneLoaderFactory("Picture");

export default Picture;
