import { gql, useQuery } from "@apollo/client";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Chart } from "react-google-charts";
import brokenGlass from "../../img/marginalia-fatal-error.png";
import layout from "../../styles/layout.module.css";
import gaEvent from "../../utils/analytics/gaEvent";
import capitalize from "../../utils/text/capitalize";
import LoadingScreen from "../shared/LoadingScreen";

const QUERY = gql`
  query ($id: ObjectID!) {
    electionResults(election: { id: $id }) {
      ... on PluralityResult {
        numEligibleVoters
        totalVotes
        isTie
        winner {
          id
          name
        }
        candidateResults {
          candidate {
            id
            name
            picture {
              alt
              resource {
                url
              }
            }
          }
          numVotes
          percentage
        }
      }
    }
  }
`;

export default function PluralityResult({ election }) {
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: election.id },
  });

  const [confetti, setConfetti] = useState(false);

  // Used to determine once the user has seen who the winner is
  const winnerRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined" && winnerRef?.current && !confetti) {
      const options = {
        threshold: 0.9,
      };

      const callback = (entries) => {
        if (entries[0].isIntersecting) {
          setConfetti(true);
          gaEvent({
            category: "confetti",
            action: "confetti shown",
            label: election.name,
            nonInteraction: true,
          });
        }
      };

      const observer = new window.IntersectionObserver(callback, options);

      observer.observe(winnerRef.current);

      return () => observer.disconnect();
    }
  }, [winnerRef, confetti, data, election?.name]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Typography variant={"body1"} color={"warning"} align={"center"}>
        There was an unexpected error: {error.message}
      </Typography>
    );
  }

  // We might run into this on first render after ssr so just add another check here
  if (!data) {
    return <LoadingScreen />;
  }

  const results = data.electionResults;

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

  const graphData = [
    ["Candidate", "Percentage of Votes"],
    ...results.candidateResults.map((candidateResult) => [
      candidateResult.candidate.name,
      candidateResult.numVotes,
    ]),
  ];

  const turnout =
    results.numEligibleVoters > 0
      ? Math.round((results.totalVotes * 1000) / results.numEligibleVoters) / 10
      : 0;

  return (
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

      <Chart
        chartType="PieChart"
        data={graphData}
        width="100%"
        height="400px"
        legendToggle
      />

      <List>
        {results.candidateResults.map(
          ({ candidate, percentage, numVotes, eliminated }) => {
            return (
              <ListItem key={candidate.id} button>
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
                      <HighlightOffRoundedIcon sx={{ color: "red" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          }
        )}
      </List>

      {!!results.winner && (
        <Confetti
          width={globalThis?.innerWidth}
          height={globalThis?.innerHeight}
          recycle={false}
          run={confetti}
          style={{ position: "fixed" }}
          numberOfPieces={200}
        />
      )}

      <Typography variant={"h3"} ref={winnerRef}>
        Winner:{" "}
        <Typography color={"secondary"} variant={"inherit"} component={"span"}>
          {results.winner ? results.winner.name : "N/A"}
        </Typography>
      </Typography>
    </Container>
  );
}
