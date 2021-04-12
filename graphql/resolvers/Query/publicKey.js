import KeyPair from "../../../models/keyPair";

export default async () => {
  const { publicKey, expiration } = await KeyPair.getCurrentKeyPair();

  return { key: publicKey, expiration };
};
