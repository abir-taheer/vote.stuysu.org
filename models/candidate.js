import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: String,

  blurb: String,
  platform: String,

  url: String,

  electionId: Schema.Types.ObjectId,

  pictureId: Schema.Types.ObjectId,
  active: Boolean,

  managerIds: [Schema.Types.ObjectId],

  social: {
    facebook: String,
    website: String,
    email: String,
    instagram: String,
  },
});

CandidateSchema.statics.idLoader = findOneLoaderFactory("Candidate");
CandidateSchema.statics.electionIdLoader = findManyLoaderFactory(
  "Candidate",
  "electionId"
);

CandidateSchema.statics.ascElectionIdLoader = findManyLoaderFactory(
  "Candidate",
  "electionId",
  {},
  {},
  { sort: { name: 1 } }
);

CandidateSchema.statics.descElectionIdLoader = findManyLoaderFactory(
  "Candidate",
  "electionId",
  {},
  {},

  { sort: { name: -1 } }
);

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
