import { ApolloError } from "apollo-server-micro";
import { get } from "axios";
import { sign } from "jsonwebtoken";
import KeyPair from "../../../models/keyPair";
import User from "../../../models/user";

export default async (_, __, { adminRequired, user }) => {
  adminRequired();

  const { privateKey, passphrase } = await KeyPair.getCurrentKeyPair();

  const { firstName, lastName, email, adminPrivileges } = user;

  const userData = { firstName, lastName, email, adminPrivileges };

  const token = await sign(
    { user: userData },
    { key: privateKey, passphrase },
    { algorithm: "RS256" }
  );

  let stuyactivitiesUsers = null;

  try {
    const {
      data: { data },
    } = await get("https://api.stuyactivities.org/stuyboe/syncUsers", {
      headers: {
        authorization: "Bearer " + token,
      },
    });

    stuyactivitiesUsers = data;
  } catch (e) {
    throw new ApolloError(
      "There was an error getting the users from StuyActivities: " + e.message,
      "FETCH_ERROR"
    );
  }

  const dbUsers = await User.find();

  const userMap = {};

  dbUsers.forEach((u) => {
    const lowerEmail = u.email.toLowerCase();
    const existingUser = userMap[lowerEmail];
    if (!existingUser || u.gradYear > existingUser.gradYear) {
      userMap[lowerEmail] = u;
    }
  });

  // Remove faculty users, people without graduation years, and inactive users
  const eligibleUsers = stuyactivitiesUsers.filter(
    (u) =>
      !u.isFaculty &&
      u.active &&
      !!u.gradYear &&
      !!u.email &&
      u.email.endsWith("@stuy.edu")
  );

  const newUsers = [];

  eligibleUsers.forEach((u) => {
    const lowerEmail = u.email.toLowerCase();
    const existingUser = userMap[lowerEmail];

    if (!existingUser || existingUser.gradYear < u.gradYear) {
      // User is not in database, add them to the array of users to add
      newUsers.push({
        firstName: u.firstName,
        lastName: u.lastName,
        email: lowerEmail,
        gradYear: u.gradYear,
        adminPrivileges: false,
      });
    }
  });

  await User.insertMany(newUsers);

  return {
    totalUsersCreated: newUsers.length,
    completedAt: new Date(),
  };
};
