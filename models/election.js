import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import calculatePluralityResults from "./methods/election/calculatePluralityResults";
import isVotingPeriod from "./methods/election/isVotingPeriod";
import getEligibleVoters from "./methods/election/getNumEligibleVoters";
import verifyUserCanVote from "./methods/election/verifyUserCanVote";
import findElectionByUrl from "./statics/election/findByUrl";
import queryElections from "./statics/election/queryElections";

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
  name: String,
  url: String,
  allowedGradYears: [Number],
  pictureId: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["runoff", "plurality"],
    default: "plurality",
  },
  start: Date,
  end: Date,
  completed: Boolean,

  // Ids of all of the users who voted
  voterIds: [Schema.Types.ObjectId],

  runoffVotes: {
    type: [
      {
        gradYear: Number,
        choices: [Schema.Types.ObjectId],
      },
    ],

    // We don't want the votes to be included when we query an election until we explicitly ask for it
    select: false,
  },

  pluralityVotes: {
    type: [
      {
        gradYear: Number,
        choice: Schema.Types.ObjectId,
      },
    ],
    select: false,
  },

  pluralityResults: {
    candidateResults: [
      {
        candidateId: Schema.Types.ObjectId,
        percentage: Number,
        numVotes: Number,
      },
    ],
    winnerId: Schema.Types.ObjectId,
    isTie: Boolean,
    totalVotes: Number,
    numEligibleVoters: Number,
  },
});

ElectionSchema.methods.isVotingPeriod = isVotingPeriod;

ElectionSchema.methods.getNumEligibleVoters = getEligibleVoters;

ElectionSchema.methods.calculatePluralityResults = calculatePluralityResults;

ElectionSchema.methods.verifyUserCanVote = verifyUserCanVote;

ElectionSchema.statics.idLoader = findOneLoaderFactory("Election");

ElectionSchema.statics.findByUrl = findElectionByUrl;
ElectionSchema.statics.queryElections = queryElections;

const Election =
  mongoose.models.Election || mongoose.model("Election", ElectionSchema);

export default Election;
