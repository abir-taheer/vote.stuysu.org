import mongoose from "./../../mongoose";

export default async function getCurrentKeyPair() {
  const KeyPair = mongoose.model("KeyPair");

  const now = new Date();

  const currentKey = await KeyPair.findOne({
    expiration: {
      $gt: now,
    },
  });

  if (currentKey) {
    return currentKey;
  }

  return await KeyPair.generateNewKeyPair();
}
