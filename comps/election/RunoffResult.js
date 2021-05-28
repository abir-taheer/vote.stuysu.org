import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import brokenGlass from "./../../img/marginalia-fatal-error.png";
import layout from "./../../styles/layout.module.css";
import { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { Chart } from "react-google-charts";
import Confetti from "react-confetti";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import useWindowSize from "react-use/lib/useWindowSize";

const QUERY = gql`
  query($id: ObjectId!) {
    electionResults(election: { id: $id }) {
      ... on RunoffResult {
        rounds {
          number
          numVotes
          eliminatedCandidates {
            id
            name
            picture {
              id
              alt
              resource {
                url
              }
            }
          }

          results {
            candidate {
              id
              name
              picture {
                id
                alt
                resource {
                  url
                }
              }
            }
            eliminated
            percentage
            numVotes
          }
        }

        winner {
          id
          name
          url
          picture {
            id
            resource {
              url
            }
          }
        }
        totalVotes
        isTie
        numEligibleVoters
      }
    }
  }
`;

const RunoffResult = ({ id }) => {
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [round, setRound] = useState(1);
  const { width } = useWindowSize();

  if (loading) {
    return <CircularProgress />;
  }

  const results = data?.electionResults;
  if (!results) {
    return <Typography>There was an error loading the results</Typography>;
  }

  if (!results.totalVotes) {
    return (
      <>
        <img
          src={brokenGlass}
          alt={"A person standing in front of a broken mirror"}
          className={layout.largeVector}
        />

        <Typography>There aren't any votes</Typography>
      </>
    );
  }

  const currentRound = results.rounds[round - 1];

  const graphData = [
    ["Candidate", "Percentage of Votes"],
    ...currentRound.results.map((candidateResult) => [
      candidateResult.candidate.name,
      candidateResult.numVotes,
    ]),
  ];

  return (
    <>
      <Typography variant={"h2"}>Round {round}</Typography>
      <Chart
        chartType="PieChart"
        data={graphData}
        width="100%"
        height="400px"
        legendToggle
      />

      {round === results.rounds.length && (
        <Confetti
          width={width * 0.9}
          height={globalThis?.document?.body?.scrollHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <List>
        {currentRound.results.map(
          ({ candidate, percentage, numVotes, eliminated }) => {
            return (
              <ListItem key={round + "-" + candidate.id} button>
                <ListItemAvatar>
                  <Avatar
                    alt={candidate.picture.alt}
                    src={candidate.picture.resource.url}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={candidate.name}
                  secondary={`${numVotes} Votes - ${percentage}%`}
                />
                {eliminated && (
                  <ListItemSecondaryAction>
                    <IconButton disabled>
                      <HighlightOffRoundedIcon style={{ color: "red" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          }
        )}
      </List>
      <br />
      <Pagination
        page={round}
        count={results.rounds.length}
        onChange={(e, p) => setRound(p)}
      />

      <br />
      {round === results.rounds.length && (
        <Typography color={"secondary"} variant={"h3"}>
          Winner: {results.winner ? results.winner.name : "N/A"}
        </Typography>
      )}
    </>
  );
};

export default RunoffResult;
