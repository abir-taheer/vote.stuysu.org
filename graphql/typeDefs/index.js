import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Announcement from "./Announcement";
import AnnouncementQueryResult from "./AnnouncementQueryResult";
import Candidate from "./Candidate";
import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionQueryResult from "./ElectionQueryResult";
import ElectionResult from "./ElectionResult";
import ElectionTypes from "./ElectionTypes";
import Mutation from "./Mutation";
import Picture from "./Picture";
import PluralityCandidateResult from "./PluralityCandidateResult";
import PluralityResult from "./PluralityResult";
import PluralityVote from "./PluralityVote";
import PublicKey from "./PublicKey";
import Query from "./Query";
import RunoffResult from "./RunoffResult";
import RunoffRound from "./RunoffRound";
import RunoffRoundResult from "./RunoffRoundResult";
import RunoffVote from "./RunoffVote";
import scalars from "./scalars";
import StuyActivitiesSync from "./StuyActivitiesSync";
import User from "./User";
import UserQueryResult from "./UserQueryResult";
import Vote from "./Vote";

const typeDefs = [
  ...graphqlScalarDefs,
  Announcement,
  AnnouncementQueryResult,
  Candidate,
  CloudinaryResource,
  Election,
  ElectionQueryResult,
  ElectionResult,
  ElectionTypes,
  Mutation,
  Picture,
  PluralityCandidateResult,
  PluralityResult,
  PluralityVote,
  PublicKey,
  Query,
  RunoffResult,
  RunoffRound,
  RunoffRoundResult,
  RunoffVote,
  scalars,
  StuyActivitiesSync,
  User,
  UserQueryResult,
  Vote,
];

export default typeDefs;
