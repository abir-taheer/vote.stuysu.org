import { gql, useQuery } from "@apollo/client";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Chart } from "react-google-charts";
import gaEvent from "../../utils/analytics/gaEvent";
import capitalize from "../../utils/text/capitalize";
import CenteredCircularProgress from "../shared/CenteredCircularProgress";
import brokenGlass from "./../../img/marginalia-fatal-error.png";
import layout from "./../../styles/layout.module.css";

const possiblePieChartColors = [
  "#00b894", // Mint Green
  "#fdcb6e", // Mustard Yellow
  "#e17055", // Salmon
  "#6c5ce7", // Soft Purple
  "#ffeaa7", // Pale Yellow
  "#74b9ff", // Soft Blue
  "#a29bfe", // Lavender
  "#ff7675", // Pastel Red
  "#fd79a8", // Pink
  "#55efc4", // Aquamarine
  "#81ecec", // Sky Blue
  "#fab1a0", // Peach
  "#636e72", // Slate Grey
  "#dfe6e9", // Cloud
  "#00cec9", // Electric Blue
  "#ff9ff3", // Mauve
  "#badc58", // Lime
  "#c7ecee", // Light Blue Grey
  "#ffeaa7", // Vanilla
  "#576574", // Blue Grey
];

const QUERY = gql`
  query ($id: ObjectID!) {
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

  const availableColors = useMemo(() => new Set(possiblePieChartColors), []);
  const candidateColorCache = useMemo(() => ({}), []);

  const getAvailableColor = () => {
    if (!availableColors.size) {
      // repeat if we run out
      possiblePieChartColors.forEach((color) => availableColors.add(color));
    }
    const value = [...availableColors][0];

    availableColors.delete(value);

    return value;
  };

  const getCandidateColor = (name) => {
    if (!candidateColorCache[name]) {
      candidateColorCache[name] = getAvailableColor();
    }

    return candidateColorCache[name];
  };

  // Used to determine once the user has seen who the winner is
  const winnerRef = useRef();

  // Once this is set to true the confetti element is displayed and the confetti will fall
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    gaEvent({
      category: "pagination",
      action: "election results round navigation",
      label: election.name + " - round: " + round,
      nonInteraction: false,
    });
  }, [round, election]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      data &&
      data.electionResults?.rounds.length === round &&
      winnerRef?.current &&
      !confetti
    ) {
      const options = {
        threshold: 0.1,
      };

      const callback = (entries) => {
        if (entries[0].isIntersecting) {
          setConfetti(true);
          gaEvent({
            category: "confetti",
            action: "confetti displayed",
            label: election.name,
            nonInteraction: true,
          });
        }
      };

      const observer = new IntersectionObserver(callback, options);

      observer.observe(winnerRef.current);

      return () => observer.disconnect();
    }
  }, [data, round, confetti, election]);

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
          There aren&apos;t any votes
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

  const colors = graphData.slice(1).map((row) =>  getCandidateColor(row[0]));

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
        options={{ colors }}
      />

      {round === results.rounds.length && (
        <Confetti
          width={globalThis?.innerWidth}
          height={globalThis?.innerHeight}
          recycle={false}
          run={confetti}
          style={{ position: "fixed" }}
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
          <Typography variant={"h3"} ref={winnerRef}>
            Winner:{" "}
            <Typography
              color={"secondary"}
              variant={"inherit"}
              component={"span"}
            >
              {results.winner ? results.winner.name : "N/A"}
            </Typography>
          </Typography>
        )}
      </Container>
    </>
  );
};

export default RunoffResult;
