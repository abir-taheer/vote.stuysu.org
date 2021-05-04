import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Announcement from "./Announcement";
import AnnouncementResult from "./AnnouncementResult";
import Candidate from "./Candidate";
import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionResult from "./ElectionResult";
import ElectionTypes from "./ElectionTypes";
import Mutation from "./Mutation";
import Picture from "./Picture";
import PluralityCandidateResult from "./PluralityCandidateResult";
import PluralityResult from "./PluralityResult";
import PluralityVote from "./PluralityVote";
import PublicKey from "./PublicKey";
import Query from "./Query";
import scalars from "./scalars";
import StuyActivitiesSyncResult from "./StuyActivitiesSyncResult";
import User from "./User";
import UserResult from "./UserResult";

const typeDefs = [
  ...graphqlScalarDefs,
  Announcement,
  AnnouncementResult,
  Candidate,
  CloudinaryResource,
  Election,
  ElectionResult,
  ElectionTypes,
  Mutation,
  Picture,
  PluralityCandidateResult,
  PluralityResult,
  PluralityVote,
  PublicKey,
  Query,
  scalars,
  StuyActivitiesSyncResult,
  User,
  UserResult,
];

export default typeDefs;
