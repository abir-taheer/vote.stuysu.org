import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: String,

  blurb: String,

  profileChanges: [
    {
      createdBy: Schema.Types.ObjectId,

      field: {
        type: String,
        enum: ["picture", "blurb", "platform"],
        required: true,
      },
      // We'll implement validation through GraphQL
      value: {
        type: Schema.Types.Mixed,
        required: true,
      },

      reviewed: {
        type: Boolean,
        default: false,
        required: true,
      },

      reviewedAt: Date,
      reviewedBy: Schema.Types.ObjectId,

      approved: {
        type: Boolean,
        default: false,
        required: true,
      },

      reasonForRejection: String,

      createdAt: {
        type: Date,
        default: () => new Date(),
      },

      updatedAt: {
        type: Date,
        default: () => new Date(),
      },
    },
  ],

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
