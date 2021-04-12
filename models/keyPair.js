import mongoose from "./mongoose";
import generateNewKeyPair from "./statics/keyPair/generateNewKeyPair";
import getCurrentKeyPair from "./statics/keyPair/getCurrentKeyPair";

const Schema = mongoose.Schema;

const KeyPairSchema = new Schema({
  privateKey: String,
  publicKey: String,
  passphrase: String,
  expiration: Date,
});

const thirtyDays = 1000 * 60 * 60 * 24 * 30;

KeyPairSchema.statics.maxAge = thirtyDays;

KeyPairSchema.statics.generateNewKeyPair = generateNewKeyPair;

KeyPairSchema.statics.getCurrentKeyPair = getCurrentKeyPair;

const KeyPair =
  mongoose.models.KeyPair || mongoose.model("KeyPair", KeyPairSchema);

export default KeyPair;
