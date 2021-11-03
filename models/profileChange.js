import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const ProfileChangeSchema = new Schema({
  candidateId: Schema.Types.ObjectId,
  createdBy: Schema.Types.ObjectId,

  field: {
    type: String,
    enum: ["pictureId", "blurb", "platform"],
    required: true,
  },

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

  reasonForRejection: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: () => new Date(),
  },

  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

ProfileChangeSchema.statics.idLoader = findOneLoaderFactory("ProfileChange");
ProfileChangeSchema.statics.candidateIdLoader = findManyLoaderFactory(
  "ProfileChange",
  "candidateId",
  {},
  {},
  {
    sort: {
      reviewed: 1,
      reviewedAt: -1,
      createdAt: -1,
    },
  }
);

const ProfileChange =
  mongoose.models.ProfileChange ||
  mongoose.model("ProfileChange", ProfileChangeSchema);

export default ProfileChange;
