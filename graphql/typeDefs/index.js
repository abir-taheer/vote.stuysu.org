import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Announcement from "./Announcement";
import AnnouncementQueryResult from "./AnnouncementQueryResult";
import Candidate from "./Candidate";
import CandidateProfileChange from "./CandidateProfileChange";
import CandidateProfileChangeType from "./CandidateProfileChangeType";
import CandidateProfilePictureChange from "./CandidateProfilePictureChange";
import CandidateProfileStringChange from "./CandidateProfileStringChange";
import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionQueryResult from "./ElectionQueryResult";
import ElectionResult from "./ElectionResult";
import ElectionTypes from "./ElectionTypes";
import FAQ from "./FAQ";
import FAQQueryResult from "./FAQQueryResult";
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
import SortType from "./SortType";
import Strike from "./Strike";
import StuyActivitiesSync from "./StuyActivitiesSync";
import User from "./User";
import UserQueryResult from "./UserQueryResult";
import Vote from "./Vote";

const typeDefs = [
  ...graphqlScalarDefs,
  Announcement,
  AnnouncementQueryResult,
  Candidate,
  CandidateProfileChange,
  CandidateProfileChangeType,
  CandidateProfilePictureChange,
  CandidateProfileStringChange,
  CloudinaryResource,
  Election,
  ElectionQueryResult,
  ElectionResult,
  ElectionTypes,
  FAQ,
  FAQQueryResult,
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
  SortType,
  Strike,
  StuyActivitiesSync,
  User,
  UserQueryResult,
  Vote,
];

export default typeDefs;
