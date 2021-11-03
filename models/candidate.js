import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: String,

  blurb: String,

  platform: String,

  url: String,

  electionId: Schema.Types.ObjectID,

  pictureId: Schema.Types.ObjectID,

  active: Boolean,

  managerIds: [Schema.Types.ObjectID],

  strikes: [
    {
      reason: String,
      weight: Number,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
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

CandidateSchema.methods.delete = () => {};

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
