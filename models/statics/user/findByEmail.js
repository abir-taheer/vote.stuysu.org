import mongoose from "./../../mongoose";
import User from "../../user";

const findUserByEmail = (email) =>
  mongoose.model("User").findOne({ email }).sort({ gradYear: -1 }).exec();

export default findUserByEmail;
