import { gql, useQuery } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import Pagination from "@material-ui/lab/Pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Chart } from "react-google-charts";
import useWindowSize from "react-use/lib/useWindowSize";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import brokenGlass from "./../../img/marginalia-fatal-error.png";
import layout from "./../../styles/layout.module.css";

const QUERY = gql`
  query ($id: ObjectId!) {
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

const RunoffResult = ({ id, election }) => {
  const { data, loading } = useQuery(QUERY, { variables: { id } });
  const [round, setRound] = useState(1);
  const { width } = useWindowSize();
  const [confetti, setConfetti] = useState(false);
  const [height, setHeight] = useState(globalThis?.innerHeight);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      data &&
      data.electionResults?.rounds.length === round &&
      !confetti
    ) {
      const scrollHandler = () => {
        const offsetTop = window.innerHeight + window.scrollY;
        const pageHeight = window.document.body.offsetHeight;

        if (pageHeight - offsetTop < 150) {
          setConfetti(true);
          setHeight(pageHeight);
        }
      };

      window.addEventListener("scroll", scrollHandler);

      return () => window.removeEventListener("scroll", scrollHandler);
    }
  }, [data, round, confetti]);

  if (loading) {
    return <CenteredCircularProgress />;
  }

  const results = data?.electionResults;

  if (!results) {
    return (
      <Typography align={"center"} variant={"body1"}>
        There was an error loading the results
      </Typography>
    );
  }

  if (!results.totalVotes) {
    return (
      <>
        <div className={layout.center}>
          <Image
            src={brokenGlass}
            alt={"A person standing in front of a broken mirror"}
            className={layout.largeVector}
            height={300}
            width={300}
            objectFit={"contain"}
          />
        </div>

        <Typography variant={"body1"} align={"center"}>
          There aren't any votes
        </Typography>
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

  const turnout =
    results.numEligibleVoters > 0
      ? Math.round((results.totalVotes * 1000) / results.numEligibleVoters) / 10
      : 0;

  return (
    <>
      <Container maxWidth={"sm"}>
        <Typography variant={"body1"}>
          Election Type: <b>{capitalize(election.type)}</b>
        </Typography>
        <Typography variant={"body1"}>
          Graduating Class{election.allowedGradYears.length > 1 && "es"}:{" "}
          <b>{election.allowedGradYears.join(", ")}</b>
        </Typography>
        <Typography variant={"body1"}>
          Number of Eligible Voters: <b>{results.numEligibleVoters}</b>
        </Typography>
        <Typography variant={"body1"}>
          Total Votes: <b>{results.totalVotes}</b>
        </Typography>
        <Typography variant={"body1"}>
          Voter Turnout: <b>{turnout}%</b>
        </Typography>
      </Container>

      <Grid
        container
        alignContent={"center"}
        justifyContent={"center"}
        spacing={3}
      >
        <Grid item>
          <IconButton
            color={"primary"}
            disabled={round === 1}
            onClick={() => setRound(round - 1)}
          >
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography
            variant={"h2"}
            align={"center"}
            className={layout.normalLine}
          >
            Round{" "}
            <Typography
              variant={"inherit"}
              component={"span"}
              color={"textSecondary"}
            >
              {round}
            </Typography>{" "}
            of{" "}
            <Typography
              variant={"inherit"}
              component={"span"}
              color={"textSecondary"}
            >
              {results.rounds.length}
            </Typography>
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            color={"primary"}
            disabled={round >= results.rounds.length}
            onClick={() => setRound(round + 1)}
          >
            <ArrowForwardIos />
          </IconButton>
        </Grid>
      </Grid>

      <Typography variant={"body2"} align={"center"}>
        {currentRound.numVotes} votes this round
      </Typography>

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
          height={height}
          recycle={false}
          run={confetti}
          numberOfPieces={200}
        />
      )}

      <Container maxWidth={"sm"}>
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
        <Typography variant={"body1"} align={"center"} color={"textSecondary"}>
          Round
        </Typography>
        <div className={layout.center}>
          <Pagination
            page={round}
            count={results.rounds.length}
            onChange={(ev, r) => setRound(r)}
          />
        </div>
        {round === results.rounds.length && (
          <Typography color={"secondary"} variant={"h3"}>
            Winner: {results.winner ? results.winner.name : "N/A"}
          </Typography>
        )}
      </Container>
    </>
  );
};

export default RunoffResult;
