import CloudinaryResource from "./CloudinaryResource";
import Query from "./Query";
import ObjectId from "graphql-scalar-objectid";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";
import User from "./User";
import Mutation from "./Mutation";
import Picture from "./Picture";
import Election from "./Election";
import Candidate from "./Candidate";

const Resolvers = {
  CloudinaryResource,
  Mutation,
  Query,
  User,
  Picture,
  Election,
  Candidate,
  // Custom Scalar Types
  ObjectId,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
};

export default Resolvers;
