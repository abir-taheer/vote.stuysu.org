import mongoose from "../../mongoose";

const findElectionByUrl = (url) => mongoose.model("Election").findOne({ url });

export default findElectionByUrl;
