import { gql, useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone";
import { useContext, useState } from "react";
import useFormatDate from "../../utils/date/useFormatDate";
import alertDialog from "../dialog/alertDialog";
import confirmDialog from "../dialog/confirmDialog";
import DateContext from "../shared/DateContext";
import styles from "./PluralityVote.module.css";

const MUTATION = gql`
  mutation ($candidateId: ObjectID!, $electionId: ObjectID!) {
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

const PluralityVote = ({ election, candidates, refetch }) => {
  const [candidateId, setCandidateId] = useState(null);
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
      <FormControl component="fieldset">
        <FormLabel component="legend">
          Select your candidate of preference
        </FormLabel>
        <RadioGroup value={candidateId} onChange={(ev, i) => setCandidateId(i)}>
          {candidates.map(({ id, name }) => (
            <FormControlLabel
              value={id}
              key={id}
              control={<Radio />}
              label={name}
              className={styles.option}
            />
          ))}
        </RadioGroup>

        <FormHelperText>
          Voting will end in {formatDuration(duration)}
        </FormHelperText>
      </FormControl>

      <Button
        fullWidth
        variant="outlined"
        color="primary"
        className={styles.submit}
        disabled={!candidateId || loading}
        onClick={handleSubmit}
      >
        Submit Vote
      </Button>
    </form>
  );
};

export default PluralityVote;
