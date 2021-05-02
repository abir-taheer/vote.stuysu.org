import { gql } from "@apollo/client/core";
import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import DateContext from "../shared/DateContext";
import moment from "moment-timezone";
import useFormatDate from "../../utils/date/useFormatDate";
import styles from "./PluralityVote.module.css";
import confirmDialog from "../dialog/confirmDialog";
import Typography from "@material-ui/core/Typography";
import alertDialog from "../dialog/alertDialog";

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
        <RadioGroup
          aria-label="quiz"
          name="quiz"
          value={candidateId}
          onChange={(ev, i) => setCandidateId(i)}
        >
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

export default PluralityVote;
