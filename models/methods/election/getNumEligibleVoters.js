import mongoose from "../../mongoose";

export default function getEligibleVoters() {
  return mongoose.model("User").countDocuments({
    gradYear: { $in: this.allowedGradYears },
  });
}
