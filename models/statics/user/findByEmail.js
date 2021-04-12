import mongoose from "./../../mongoose";

const findUserByEmail = (email) => mongoose.model("User").findOne({ email });

export default findUserByEmail;
