import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import Announcement from "./Announcement";
import Candidate from "./Candidate";
import CandidateProfileChange from "./CandidateProfileChange";
import CandidateProfilePictureChange from "./CandidateProfilePictureChange";
import CandidateProfileStringChange from "./CandidateProfileStringChange";
import CloudinaryResource from "./CloudinaryResource";
import Election from "./Election";
import ElectionResult from "./ElectionResult";
import Mutation from "./Mutation";
import Picture from "./Picture";
import PluralityCandidateResult from "./PluralityCandidateResult";
import PluralityResult from "./PluralityResult";
import PluralityVote from "./PluralityVote";
import Query from "./Query";
import RunoffResult from "./RunoffResult";
import RunoffRound from "./RunoffRound";
import RunoffRoundResult from "./RunoffRoundResult";
import RunoffVote from "./RunoffVote";
import User from "./User";
import Vote from "./Vote";

const Resolvers = {
  // Custom Scalar Types
  ...graphqlScalarResolvers,

  Announcement,
  Candidate,
  CandidateProfileChange,
  CandidateProfilePictureChange,
  CandidateProfileStringChange,
  CloudinaryResource,
  Election,
  ElectionResult,
  Mutation,
  Picture,
  PluralityCandidateResult,
  PluralityResult,
  PluralityVote,
  Query,
  RunoffResult,
  RunoffRound,
  RunoffRoundResult,
  RunoffVote,
  User,
  Vote,
};

export default Resolvers;
