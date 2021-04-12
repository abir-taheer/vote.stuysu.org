import mongoose from "../../mongoose";

const getCurrentJWTSecret = () => {
  const model = mongoose.model("JWTSecret");
  const now = new Date();
  return model.findOne({ useUntil: { $gt: now } });
};

export default getCurrentJWTSecret;
