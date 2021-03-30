import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
  name: String,
  url: String,
  allowedGradYears: [Number],
  coverPicId: String,
  type: {
    type: String,
    enum: ["runoff", "plurality"],
    default: "plurality",
  },
  start: Date,
  end: Date,
  completed: Boolean,
});

ElectionSchema.statics.idLoader = findOneLoaderFactory("Election");

const Election =
  mongoose.models.Election || mongoose.model("Election", ElectionSchema);

export default Election;
