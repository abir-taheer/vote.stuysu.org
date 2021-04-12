import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionResult from "./ElectionResult";
import ElectionTypes from "./ElectionTypes";
import Mutation from "./Mutation";
import Query from "./Query";
import scalars from "./scalars";
import User from "./User";
import UserResult from "./UserResult";
import Candidate from "./Candidate";
import Picture from "./Picture";
import PluralityVote from "./PluralityVote";
import PublicKey from "./PublicKey";

const typeDefs = [
  CloudinaryResource,
  Election,
  ElectionTypes,
  Mutation,
  Query,
  User,
  UserResult,
  Candidate,
  Picture,
  PluralityVote,
  scalars,
  ElectionResult,
  PublicKey,
];

export default typeDefs;
