import { verify } from "jsonwebtoken";
import JWTSecret from "../../models/jwtSecret";

const silentVerify = async (jwt, secret) => {
  try {
    return await verify(jwt, secret);
  } catch (e) {
    return null;
  }
};

const getJWTData = async (jwt) => {
  const now = new Date();

  /** @type Array */
  const possibleSecrets = await JWTSecret.find({
    maxTokenExpiration: {
      $gt: now,
    },
  });

  let data;

  for (let i = 0; i < possibleSecrets.length; i++) {
    const { secret } = possibleSecrets[i];
    data = await silentVerify(jwt, secret);

    if (data) {
      return data;
    }
  }

  return null;
};

export default getJWTData;
