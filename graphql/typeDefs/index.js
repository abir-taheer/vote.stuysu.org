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
import StuyActivitiesSyncResult from "./StuyActivitiesSyncResult";
import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Announcement from "./Announcement";

const typeDefs = [
  Announcement,
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
  StuyActivitiesSyncResult,
  ...graphqlScalarDefs,
];

export default typeDefs;
