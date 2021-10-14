import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const FAQSchema = new Schema({
  title: String,
  url: {
    type: String,
    unique: true,
  },
  body: String,
  plainTextBody: String,
  createdAt: Date,
  updatedAt: Date,
});

FAQSchema.statics.idLoader = findOneLoaderFactory("FAQ", "_id");
FAQSchema.statics.urlLoader = findOneLoaderFactory("FAQ", "url");

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);

export default FAQ;
