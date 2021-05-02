import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import findManyLoaderFactory from "../utils/dataloaders/findManyLoaderFactory";
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: String,
  body: String,
  start: Date,
  end: Date,
  permanent: Boolean,
  electionId: Schema.Types.ObjectId,
  showOnHome: Boolean,
});

AnnouncementSchema.statics.idLoader = findOneLoaderFactory("Announcement");
AnnouncementSchema.statics.electionIdLoaderAll = findManyLoaderFactory(
  "Announcement",
  "electionId"
);

AnnouncementSchema.statics.electionIdLoaderActive = findManyLoaderFactory(
  "Announcement",
  "electionId",
  () => ({
    $or: [
      {
        start: {
          $lt: new Date(),
        },
        end: {
          $gt: new Date(),
        },
      },
      {
        permanent: true,
      },
    ],
  })
);

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
