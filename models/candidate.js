import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: String,
  blurb: String,

  url: String,

  electionId: Schema.Types.ObjectId,

  pictureId: Schema.Types.ObjectId,
  isActive: Boolean,

  managerIds: [Schema.Types.ObjectId],

  social: {
    facebook: String,
    website: String,
    email: String,
    instagram: String,
  },
});

CandidateSchema.statics.idLoader = findOneLoaderFactory("id");
CandidateSchema.statics.electionIdLoader = findManyLoaderFactory("electionId");

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
