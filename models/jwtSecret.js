import mongoose from "./mongoose";
import generateJWTSecret from "./statics/jwtSecret/generateNewSecret";
import getCurrentJWTSecret from "./statics/jwtSecret/getCurrentSecret";

const Schema = mongoose.Schema;

const JWTSecretSchema = new Schema({
  secret: String,
  createdAt: Date,
  useUntil: Date,
  maxTokenExpiration: Date,
});

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

JWTSecretSchema.statics.maxAge = thirtyDays;

JWTSecretSchema.statics.generateNewSecret = generateJWTSecret;

JWTSecretSchema.statics.getCurrentSecret = getCurrentJWTSecret;

const JWTSecret =
  mongoose.models.JWTSecret || mongoose.model("JWTSecret", JWTSecretSchema);

export default JWTSecret;
