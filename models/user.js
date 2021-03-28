import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";

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
UserSchema.statics.findByEmail = (email) => User.findOne({ email });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
