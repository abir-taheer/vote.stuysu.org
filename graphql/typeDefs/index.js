import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionTypes from "./ElectionTypes";
import Mutation from "./Mutation";
import Query from "./Query";
import scalars from "./scalars";
import User from "./User";
import Candidate from "./Candidate";
import Picture from "./Picture";
import PluralityVote from "./PluralityVote";

const typeDefs = [
  CloudinaryResource,
  Election,
  ElectionTypes,
  Mutation,
  Query,
  User,
  Candidate,
  Picture,
  PluralityVote,
  scalars,
];

export default typeDefs;
