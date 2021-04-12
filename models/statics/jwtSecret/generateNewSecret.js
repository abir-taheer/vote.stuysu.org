import { randomBytes } from "crypto";
import mongoose from "../../mongoose";

const generateJWTSecret = () => {
  const secret = randomBytes(32).toString("hex");
  const model = mongoose.model("JWTSecret");

  const now = new Date();

  const useUntil = new Date(now.getTime() + model.maxAge);
  const maxTokenExpiration = new Date(useUntil.getTime() + model.maxAge);

  return model.create({
    secret,
    useUntil,
    maxTokenExpiration,
    createdAt: now,
  });
};

export default generateJWTSecret;
