import mongoose from "./../../mongoose";

export default function hasEverVoted() {
  const Election = mongoose.model("Election");
  return Election.exists({ voterIds: this._id });
}
