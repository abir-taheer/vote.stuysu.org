import { gql } from "@apollo/client/core";
import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import DateContext from "../shared/DateContext";
import moment from "moment-timezone";
import useFormatDate from "../../utils/date/useFormatDate";
import styles from "./RunoffVote.module.css";
import confirmDialog from "../dialog/confirmDialog";
import Typography from "@material-ui/core/Typography";
import alertDialog from "../dialog/alertDialog";
import Head from "next/head";

const MUTATION = gql`
  mutation($candidateId: ObjectId!, $electionId: ObjectId!) {
    votePlurality(candidateId: $candidateId, electionId: $electionId) {
      id
      choice {
        id
        name
      }
      gradYear
    }
  }
`;

const RunoffVote = ({ election, candidates, refetch }) => {
  const { formatDuration } = useFormatDate(false);
  const { getNow } = useContext(DateContext);
  const [vote, { loading }] = useMutation(MUTATION, {
    variables: {
      electionId: election.id,
      candidateId,
    },
  });

  const now = moment(getNow());
  const end = moment(election.end);
  const duration = moment.duration(end.diff(now));

  const handleSubmit = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Vote",
      body: (
        <Typography variant={"body1"}>
          Just to confirm, you would like to cast your vote for{" "}
          <Typography component={"span"} color={"primary"}>
            {candidates.find((a) => a.id === candidateId).name}
          </Typography>
          ?
        </Typography>
      ),
    });

    if (confirmation) {
      try {
        const { data } = await vote();
        window.localStorage.setItem(
          "vote-id-" + election.id,
          data.votePlurality.id
        );
        await refetch();
      } catch (e) {
        await alertDialog({
          title: "Could not perform action",
          body: (
            <Typography variant={"body1"}>
              There was an error processing your vote:{" "}
              <Typography
                component={"span"}
                color={"primary"}
                children={e.message}
              />
            </Typography>
          ),
        });
      }
    }
  };

  return (
    <form>
      <Head></Head>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Order the candidates based on your preference
        </FormLabel>
        {candidates.map((c) => (
          <p>{c.name}</p>
        ))}

        <FormHelperText>
          Voting will end in {formatDuration(duration)}
        </FormHelperText>
        <Button
          variant="outlined"
          color="primary"
          className={styles.submit}
          disabled={!candidateId || loading}
          onClick={handleSubmit}
        >
          Submit Vote
        </Button>
      </FormControl>
    </form>
  );
};

export default RunoffVote;
