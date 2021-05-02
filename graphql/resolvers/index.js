import CloudinaryResource from "./CloudinaryResource";
import Query from "./Query";
import ObjectId from "graphql-scalar-objectid";
import User from "./User";
import Mutation from "./Mutation";
import Picture from "./Picture";
import Election from "./Election";
import Candidate from "./Candidate";
import PluralityVote from "./PluralityVote";
import Announcement from "./Announcement";
import { resolvers as graphqlScalarResolvers } from "graphql-scalars";

const Resolvers = {
  Announcement,
  CloudinaryResource,
  Mutation,
  Query,
  User,
  Picture,
  Election,
  Candidate,
  PluralityVote,
  // Custom Scalar Types
  ObjectId,
  ...graphqlScalarResolvers,
};

export default Resolvers;
