import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import findUserByEmail from "./statics/user/findByEmail";
import queryUsers from "./statics/user/queryUsers";
import hasEverVoted from "./methods/user/hasEverVoted";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  googleSub: String,
  gradYear: Number,
  adminPrivileges: Boolean,
});

UserSchema.statics.idLoader = findOneLoaderFactory("User");
UserSchema.statics.emailLoader = findOneLoaderFactory("User", "email");
UserSchema.statics.findByEmail = findUserByEmail;
UserSchema.statics.queryUsers = queryUsers;

UserSchema.methods.hasEverVoted = hasEverVoted;

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
